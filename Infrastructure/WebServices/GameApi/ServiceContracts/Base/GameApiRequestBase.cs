﻿using AFT.RegoV2.GameApi.Interfaces;
using System.Runtime.Serialization;

namespace AFT.RegoV2.GameApi.ServiceContracts
{
    [DataContract]
    public class GameApiRequestBase : IAuthTokenHolder
    {
        [DataMember(Name="authtoken")]
        public string AuthToken { get; set; }

        [DataMember(Name = "testmode")]
        public string TestMode { get; set; }
    }
}
