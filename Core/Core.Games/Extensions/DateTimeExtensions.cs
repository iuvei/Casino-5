﻿using System;

namespace AFT.RegoV2.Core.Game.Extensions
{
    public static class DateTimeExtensions
    {
        private const long UnixEpoch = 621355968000000000L;
        private static readonly DateTime MinDateTimeUtc = new DateTime(1, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        public static DateTime ToStableUtc(this DateTime dateTime)
        {
            if (dateTime.Kind == DateTimeKind.Utc)
                return dateTime;
            if (dateTime == DateTime.MinValue)
                return MinDateTimeUtc;

#if SILVERLIGHT
            // Silverlight 3, 4 and 5 all work ok with DateTime.ToUniversalTime, but have no TimeZoneInfo.ConverTimeToUtc implementation.
            return dateTime.ToUniversalTime();
#else
            // .Net 2.0 - 3.5 has an issue with DateTime.ToUniversalTime, but works ok with TimeZoneInfo.ConvertTimeToUtc.
            // .Net 4.0+ does this under the hood anyway.
            return TimeZoneInfo.ConvertTimeToUtc(dateTime);
#endif
        }

        public static long ToUnixTimeSeconds(this DateTime dateTime)
        {
            return (dateTime.ToStableUtc().Ticks - UnixEpoch) / TimeSpan.TicksPerSecond;
        }  
        public static DateTime UnixTimeSecondsToDateTime(this long unixTimeStamp )
        {
            // Unix timestamp is seconds past epoch
            var dtDateTime = MinDateTimeUtc;
            dtDateTime = dtDateTime.AddSeconds( unixTimeStamp ).ToLocalTime();
            return dtDateTime;
        }
    }
}