using System.Runtime.Serialization;

namespace AFT.RegoV2.GameApi.ServiceContracts
{
    [DataContract, KnownType(typeof(BetCommandRequest))]
    public class FreeBet : BetCommandRequest
    {
    }

    [DataContract, KnownType(typeof(BetCommandResponse))]
    public class FreeBetResponse : BetCommandResponse
    {
    }
}
