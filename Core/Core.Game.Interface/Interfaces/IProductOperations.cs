﻿using System;
using System.Threading.Tasks;
using AFT.UGS.Core.Messages.Products;
using AFT.UGS.Core.Messages.Products.External;

namespace AFT.RegoV2.Core.Game.Interface.Interfaces
{
    public interface IProductOperations
    {
        Task<string> GetLobbyTokenAsync(Guid lobbyId);

        Task<ProductsForPlayerResponse> GetProductsForPlayerAsync(
            Guid lobbyId,
            Guid playerId,
            string lobbyUrl,
            string playerIpAddress,
            string userAgent);
    }
}
