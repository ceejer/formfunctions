using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Text;

namespace EventViewerLog
{
    public static class ExceptionDataKey
    {
        public const string DisableLogEntry = "DisableLogEntry";
    }

    public class EventViewerLogging
    {
        #region LogMessage
        /// <summary>
        /// Writes message to event log
        /// </summary>
        /// <param name="eventSource">The Event Source to use when writing the event out </param>
        /// <param name="message">The message to be written</param>
        /// <param name="logEntryType">EventLogEntryType (Error, Information, Warning, etc)</param>
        /// <returns></returns>
        public static void LogMessage(string eventSource, EventLogEntryType logEntryType, string[] messages)
        {
            StringBuilder sb = new StringBuilder();

            foreach (string message in messages)
            {
                sb.Append(message).Append(Environment.NewLine);
            }

            LogMessage(eventSource, logEntryType, sb.ToString());
        }

        public static void LogMessage(string eventSource, EventLogEntryType logEntryType, string message)
        {
            EventLog.WriteEntry(eventSource, message, logEntryType);
        }

        /// <summary>
        /// Writes message to event log assuming the eventSource is stored 
        /// in the configuration file under the key name EventSource
        /// </summary>
        /// <param name="message">The message to be written</param>
        /// <param name="logEntryType">EventLogEntryType (Error, Information, Warning, etc)</param>
        /// <returns></returns>
        public static void LogMessage(EventLogEntryType logEntryType, string message)
        {
            LogMessage(GetDefaultEventSource(), logEntryType, message);
        }

        public static void LogMessage(EventLogEntryType logEntryType, string[] messages)
        {
            LogMessage(GetDefaultEventSource(), logEntryType, messages);
        }

        /// <summary>
        /// Writes message to event log with eventSource that is stored 
        /// in the configuration file under the key name that is passed
        /// </summary>
        /// <param name="message">The message to be written</param>
        /// <param name="logEntryType">EventLogEntryType (Error, Information, Warning, etc)</param>
        /// <param name="eventSourceKeyName">The Event Source key name in the configuration file</param>
        /// <returns></returns>
        public static void LogMessage(EventLogEntryType logEntryType, string eventSourceKeyName, string message)
        {
            LogMessage(Config.GetString(eventSourceKeyName), logEntryType, message);
        }

        public static void LogMessage(EventLogEntryType logEntryType, string eventSourceKeyName, string[] messages)
        {
            LogMessage(Config.GetString(eventSourceKeyName), logEntryType, messages);
        }
        #endregion

        #region LogException

        /// <summary>
        /// Writes exception to event log assuming the eventSource is stored 
        /// in the configuration file under the key name EventSource and the event type is error
        /// </summary>
        /// <param name="exception">The exception to be written</param>
        /// <returns></returns>
        public static void LogException(Exception ex)
        {
            LogException(ex, null);
        }

        /// <summary>
        /// Writes exception to event log with additional messages, assuming the eventSource is stored 
        /// in the configuration file under the key name EventSource and the event type is error
        /// </summary>
        /// <param name="exception">The exception to be written</param>
        /// <returns></returns>
        public static void LogException(Exception ex, params string[] messages)
        {
            LogException(GetDefaultEventSource(), ex, EventLogEntryType.Error, messages);
        }

        /// <summary>
        /// Writes exception to event log assuming it is an error type log entry
        /// </summary>
        /// <param name="eventSource">The Event Source to use when writing the event out </param>
        /// <param name="exception">The exception to be written</param>
        /// <param name="logEntryType">EventLogEntryType (Error, Information, Warning, etc)</param>
        /// <returns></returns>
        public static void LogException(string eventSource, Exception ex)
        {
            LogException(eventSource, ex, EventLogEntryType.Error, null);
        }

        public static void LogException(string eventSource, Exception ex, params string[] messages)
        {
            LogException(eventSource, ex, EventLogEntryType.Error, messages);
        }

        /// <summary>
        /// Writes exception to event log assuming the eventSource is stored 
        /// in the configuration file under the key name EventSource
        /// </summary>
        /// <param name="exception">The exception to be written</param>
        /// <param name="logEntryType">EventLogEntryType (Error, Information, Warning, etc)</param>
        /// <returns></returns>
        public static void LogException(Exception ex, EventLogEntryType logEntryType)
        {
            LogException(GetDefaultEventSource(), ex, logEntryType);
        }

        /// <summary>
        /// Writes exception to event log
        /// </summary>
        /// <param name="eventSource">The Event Source to use when writing the event out </param>
        /// <param name="exception">The exception to be written</param>
        /// <param name="logEntryType">EventLogEntryType (Error, Information, Warning, etc)</param>
        /// <returns></returns>
        public static void LogException(string eventSource, Exception ex, EventLogEntryType logEntryType)
        {
            LogException(eventSource, ex, logEntryType, null);
        }

        /// <summary>
        /// Writes message to event log with eventSource that is stored 
        /// in the configuration file under the key name that is passed
        /// </summary>
        /// <param name="exception">The exception to be written</param>
        /// <param name="logEntryType">EventLogEntryType (Error, Information, Warning, etc)</param>
        /// <param name="eventSourceKeyName">The Event Source key name in the configuration file</param>
        /// <returns></returns>
        public static void LogException(Exception ex, EventLogEntryType logEntryType, string eventSourceKeyName)
        {
            LogException(Config.GetString(eventSourceKeyName), ex, logEntryType);
        }

        public static void LogException(string eventSource, Exception ex, EventLogEntryType logEntryType, params string[] messages)
        {
            List<string> errorMessages = new List<string>();
            bool disableLogEntry = false;

            if (messages != null)
                errorMessages.AddRange(messages);

            if (ex.Data != null)
            {
                disableLogEntry = (ex.Data[ExceptionDataKey.DisableLogEntry] != null) &&
                    (ex.Data[ExceptionDataKey.DisableLogEntry].ToString().ToLower() == bool.TrueString.ToLower());

                if (errorMessages.Count > 0)
                    errorMessages.Add(string.Empty);

                foreach (System.Collections.DictionaryEntry de in ex.Data)
                {
                    errorMessages.Add(string.Format("{0} = {1}", de.Key, de.Value));
                }
            }

            if (errorMessages.Count > 0)
                errorMessages.Add(string.Empty);

            errorMessages.Add(ex.ToString());

            if (!disableLogEntry)
                LogMessage(eventSource, logEntryType, errorMessages.ToArray());
        }

        #endregion

        #region LogErrorMessage
        /// <summary>
        /// Writes message to event log as error
        /// </summary>
        /// <param name="eventSource">The Event Source to use when writing the event out </param>
        /// <param name="message">The message to be written</param>
        /// <returns></returns>
        public static void LogErrorMessage(string eventSource, string message)
        {
            LogMessage(eventSource, EventLogEntryType.Error, message);
        }

        /// <summary>
        /// Writes message to event log assuming the eventSource is stored 
        /// in the configuration file under the key name eventSource
        /// </summary>
        /// <param name="message">The message to be written</param>
        /// <returns></returns>
        public static void LogErrorMessage(params string[] messages)
        {
            LogMessage(EventLogEntryType.Error, messages);
        }
        #endregion

        #region LogInformationalMessage
        /// <summary>
        /// Writes message to event log as informational
        /// </summary>
        /// <param name="eventSource">The Event Source to use when writing the event out </param>
        /// <param name="message">The message to be written</param>
        /// <returns></returns>
        public static void LogInformationalMessage(string eventSource, string message)
        {
            LogMessage(eventSource, EventLogEntryType.Information, message);
        }

        /// <summary>
        /// Writes message to event log assuming the eventSource is stored 
        /// in the configuration file under the key name eventSource
        /// </summary>
        /// <param name="message">The message to be written</param>
        /// <returns></returns>
        public static void LogInformationalMessage(string message)
        {
            LogMessage(EventLogEntryType.Information, message);
        }
        #endregion

        #region LogWarningMessage
        /// <summary>
        /// Writes message to event log as informational
        /// </summary>
        /// <param name="eventSource">The Event Source to use when writing the event out </param>
        /// <param name="message">The message to be written</param>
        /// <returns></returns>
        public static void LogWarningMessage(string eventSource, string message)
        {
            LogMessage(eventSource, EventLogEntryType.Warning, message);
        }
        /// <summary>
        /// Writes message to event log assuming the eventSource is stored 
        /// in the configuration file under the key name eventSource
        /// </summary>
        /// <param name="message">The message to be written</param>
        /// <returns></returns>
        public static void LogWarningMessage(string message)
        {
            LogMessage(EventLogEntryType.Warning, message);
        }
        #endregion

        #region GetDefaultEventSource
        private static string GetDefaultEventSource()
        {
            try
            {
                return Config.GetString("EventSource");
            }
            catch
            {
                //try alternate case
                return Config.GetString("eventSource");
            }
        }
        #endregion
    }
}
