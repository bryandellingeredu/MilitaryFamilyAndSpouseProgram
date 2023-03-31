using Azure.Identity;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application
{
    public class GraphHelper
    {
        private static Settings _settings;
        private static ClientSecretCredential _clientSecretCredential;
        private static GraphServiceClient _appClient;
        public static string GetEEMServiceAccount() => _settings.ServiceAccount;

        public static void InitializeGraph(Settings settings,
       Func<DeviceCodeInfo, CancellationToken, Task> deviceCodePrompt)
        {
            _settings = settings;
        }

        private static void EnsureGraphForAppOnlyAuth()
        {
            _ = _settings ??
              throw new System.NullReferenceException("Settings cannot be null");

            if (_clientSecretCredential == null)
            {
                _clientSecretCredential = new ClientSecretCredential(
                  _settings.TenantId, _settings.ClientId, _settings.ClientSecret);
            }

            if (_appClient == null)
            {
                _appClient = new GraphServiceClient(_clientSecretCredential,
                  new[] {
            "https://graph.microsoft.com/.default"
                  });
            }
        }

        public static Task<IGraphServicePlacesCollectionPage> GetRoomsAsync()
        {
            EnsureGraphForAppOnlyAuth();
            _ = _appClient ??
              throw new System.NullReferenceException("Graph has not been initialized for app-only auth");
            var roomUrl = _appClient.Places.AppendSegmentToRequestUrl("microsoft.graph.room");
            var placesRequest = new GraphServicePlacesCollectionRequest(roomUrl, _appClient, null).GetAsync();
            return placesRequest;
        }

        public static Task<Event> GetEventAsync(string email, string id)
        {

            EnsureGraphForAppOnlyAuth();
            _ = _appClient ??
              throw new System.NullReferenceException("Graph has not been initialized for app-only auth");

            return _appClient.Users[email].Events[id]
              .Request()
              .GetAsync();

        }
    }
}
