
    public class MvcApplication : System.Web.HttpApplication {
        protected void Application_Error(object sender, EventArgs e) {
            string mthd = ""; string currentController = "Err";
            string currentAction = "Index";

            Exception applicationError = Server.GetLastError();
            if (applicationError is System.Security.Cryptography.CryptographicException || applicationError.InnerException is System.Security.Cryptography.CryptographicException) {
                MiscUtility.LogError(applicationError);
                try {
                    MiscUtility.Logout();
                } catch { }
                return;
            }
            try {
                var s = new StackTrace(applicationError);
                var thisasm = Assembly.GetExecutingAssembly();
                var methods = s.GetFrames().Select(f => f.GetMethod()).FirstOrDefault(m => m.Module.Assembly == thisasm);
                if (methods != null && !string.IsNullOrWhiteSpace(methods.Name)) {
                    mthd = string.Format("Error in Method[{0}]", methods.Name);
                }
            } catch {
                //unable to grab originating method;
            }
            if (applicationError is System.Web.HttpException && (applicationError.Message.StartsWith("The controller for path") || applicationError.Message.StartsWith("A public action method"))) {
                MiscUtility.LogWarn("Invalid Path", applicationError);
            } else if (applicationError is ApplicationException && applicationError.Message.StartsWith("There are no actively monitored sites for account")) {
                MiscUtility.LogWarn("Inactive Account", applicationError);
            } else {
                MiscUtility.LogError(mthd, applicationError);
            }
            try {

                HttpContext httpContext = HttpContext.Current;
                if (httpContext != null) {
                    MvcHandler mch = (MvcHandler)httpContext.CurrentHandler;
                    if (mch != null && mch.RequestContext.HttpContext != null && mch.RequestContext.HttpContext.Request != null && mch.RequestContext.HttpContext.Request.IsAjaxRequest()) {
                        RequestContext requestContext = mch.RequestContext;
                        /* When the request is ajax the system can automatically handle a mistake with a JSON response. 
                           Then overwrites the default response */

                        var contentType = requestContext.HttpContext.Request.ContentType;
                        string controllerName = requestContext.RouteData.GetRequiredString("controller");
                        if (contentType.Contains("json")) {

                            httpContext.Response.Clear();
                            if (!string.IsNullOrWhiteSpace(controllerName)) {
                                IControllerFactory factory = ControllerBuilder.Current.GetControllerFactory();
                                IController controller = factory.CreateController(requestContext, controllerName);
                                ControllerContext controllerContext = new ControllerContext(requestContext, (ControllerBase)controller);

                                JsonResult jsonResult = new JsonResult {
                                    Data = new { success = false, message = applicationError.Message },
                                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                                };
                                jsonResult.ExecuteResult(controllerContext);
                                return;
                            } else {
                                try {
                                    httpContext.Response.ContentType = "application/json";
                                    httpContext.Response.StatusCode = 200;
                                    httpContext.Response.Write(new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(
                    new { success = false, message = applicationError.Message })
                                        );
                                } catch { }
                            }
                            httpContext.Response.End();
                            return;
                        } else if (contentType.Contains("form") || contentType.Contains("html")) {
                            var htmlmsg = System.Web.HttpUtility.HtmlEncode(applicationError.Message);
                            httpContext.Response.Clear();
                            if (!string.IsNullOrWhiteSpace(controllerName)) {
                                IControllerFactory factory = ControllerBuilder.Current.GetControllerFactory();
                                IController controller = factory.CreateController(requestContext, controllerName);
                                ControllerContext controllerContext = new ControllerContext(requestContext, (ControllerBase)controller);
                                ContentResult ar = new ContentResult { Content = "An unhandled error has occured: <br>" + htmlmsg };
                                ar.ExecuteResult(controllerContext);
                            } else {
                                try {
                                    httpContext.Response.ContentType = "text/html";
                                    httpContext.Response.StatusCode = 200;
                                    httpContext.Response.Write("An unhandled error has occured: <br>" + htmlmsg);
                                } catch { }
                            }
                            httpContext.Response.End();
                            return;
                        }


                    } else if (applicationError is HttpRequestValidationException) {
                        if(!Response.IsRequestBeingRedirected)
                        Response.Redirect("~/Err/RequestValidationError");
                    }

                    var MVCContext = ((MvcApplication)sender).Context;

                    var currentRouteData = RouteTable.Routes.GetRouteData(new HttpContextWrapper(MVCContext));


                    if (currentRouteData != null) {
                        if (currentRouteData.Values["controller"] != null &&
                            !String.IsNullOrEmpty(currentRouteData.Values["controller"].ToString())) {
                            currentController = currentRouteData.Values["controller"].ToString();
                        }

                        if (currentRouteData.Values["action"] != null &&
                            !String.IsNullOrEmpty(currentRouteData.Values["action"].ToString())) {
                            currentAction = currentRouteData.Values["action"].ToString();
                        }
                    }

                    var routeData = new RouteData();
                    var action = "Index";
                    var statusCode = 400;
                    if (applicationError is HttpException) {
                        var httpEx = applicationError as HttpException;
                        statusCode = httpEx.GetHttpCode();

                        switch (httpEx.GetHttpCode()) {
                            case 401:
                            case 403:
                                action = "Forbidden";
                                break;
                            case 400:
                            case 404:
                                action = "MissingPage";
                                break;
                            case 500:
                            default:
                                action = "Index";
                                break;
                        }

                    } else if (applicationError is System.Security.Authentication.AuthenticationException) {
                        action = "Forbidden";
                        statusCode = 403;
                    } else if (applicationError is System.Data.SqlClient.SqlException) {
                     //   applicationError = new Exception(string.Format("A SQL error has occured, please notify Customer Service."));

                    }


                    MVCContext.ClearError();
                    MVCContext.Response.Clear();
                    MVCContext.Response.StatusCode = statusCode;
                    MVCContext.Response.TrySkipIisCustomErrors = true;
                    routeData.Values["controller"] = "Err";
                    routeData.Values["action"] = action;

                    using (Controller controller = new Controllers.ErrController()) {
                        controller.ViewData.Model = new HandleErrorInfo(applicationError, currentController, currentAction);
                        ((IController)controller).Execute(new RequestContext(new HttpContextWrapper(MVCContext), routeData));
                        return;
                    }

                }
            } catch (Exception exception) {
                MiscUtility.LogError("Unhandled Exception handling the exception.", exception);
            }
                MiscUtility.LogError(string.Format("Unhandled Exception{0} {1}/{2}", mthd, currentAction, currentController), applicationError);
            
        }
    }
