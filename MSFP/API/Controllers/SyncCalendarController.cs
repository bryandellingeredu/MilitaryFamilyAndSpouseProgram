using Application;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
using Microsoft.Graph;

namespace API.Controllers
{
    public class SyncCalendarController : BaseAPIController
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;

           public SyncCalendarController(DataContext context, IConfiguration config)
        {
            _context = context;
            _config = config;

        } 

           [HttpGet]
         public async Task<IActionResult> Get(){
            Settings s = new Settings();
            var settings = s.LoadSettings(_config);
            GraphHelper.InitializeGraph(settings, (info, cancel) => Task.FromResult(0));
            var allrooms = await GraphHelper.GetRoomsAsync();
          
              StringWriter writer = new StringWriter();
              writer.WriteLine("BEGIN:VCALENDAR");
              writer.WriteLine("PRODID://MSFP//USAWC//EN");
              writer.WriteLine("VERSION:2.0");
              writer.WriteLine("METHOD:PUBLISH");
              writer.WriteLine("X-WR-CALNAME:MSFP");

              // Add VTIMEZONE component
            writer.WriteLine("BEGIN:VTIMEZONE");
            writer.WriteLine("TZID:America/New_York");
            writer.WriteLine("BEGIN:STANDARD");
            writer.WriteLine("DTSTART:16010101T020000");
            writer.WriteLine("RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=11");
            writer.WriteLine("TZOFFSETFROM:-0400");
            writer.WriteLine("TZOFFSETTO:-0500");
            writer.WriteLine("END:STANDARD");
            writer.WriteLine("BEGIN:DAYLIGHT");
            writer.WriteLine("DTSTART:16010101T020000");
            writer.WriteLine("RRULE:FREQ=YEARLY;BYDAY=2SU;BYMONTH=3");
            writer.WriteLine("TZOFFSETFROM:-0500");
            writer.WriteLine("TZOFFSETTO:-0400");
            writer.WriteLine("END:DAYLIGHT");
            writer.WriteLine("END:VTIMEZONE");

            DateTime startDateLimit = DateTime.UtcNow.AddMonths(-2);
            DateTime endDateLimit = DateTime.UtcNow.AddMonths(12);

             var query = _context.Activities.AsQueryable();
              query = query.Where(a => a.Start > startDateLimit && a.End < endDateLimit);
              query = query.Where(a => !a.LogicalDeleteInd);
              query = query.Where(a => a.MFP);

           var activities = await query.ToListAsync();
              foreach (Activity activity in activities)
            {
                writer.WriteLine("BEGIN:VEVENT");
                writer.WriteLine($"DTSTAMP:{DateTime.UtcNow.ToString("yyyyMMddTHHmmssZ")}");
                if (activity.AllDayEvent)
                {
                    writer.WriteLine($"DTSTART;VALUE=DATE:{activity.Start.ToString("yyyyMMdd")}");
                    writer.WriteLine($"DTEND;VALUE=DATE:{activity.End.AddDays(1).ToString("yyyyMMdd")}");
                }
                else
                {
                    writer.WriteLine($"DTSTART;TZID=America/New_York:{activity.Start.ToString("yyyyMMddTHHmmss")}");
                    writer.WriteLine($"DTEND;TZID=America/New_York:{activity.End.ToString("yyyyMMddTHHmmss")}");
                }
                writer.WriteLine($"LOCATION:{await GetLocation(activity.EventLookup, activity.PrimaryLocation, activity.CoordinatorEmail, allrooms)}");
                writer.WriteLine("SEQUENCE:0");
                writer.WriteLine($"SUMMARY:{activity.Title}");
                writer.WriteLine($"DESCRIPTION:{activity.Description}");
                writer.WriteLine("TRANSP:OPAQUE");
                writer.WriteLine($"UID:{activity.Id}");
                writer.WriteLine("X-MICROSOFT-CDO-BUSYSTATUS:BUSY");
                if (activity.Category != null)
                {
                    writer.WriteLine($"CATEGORIES:{activity.Category}");
                }
                writer.WriteLine("END:VEVENT");
            }

            writer.WriteLine("END:VCALENDAR");

            return Ok(writer.ToString());
        }

          private async Task<string> GetLocation(string eventLookup, string primaryLocation, string activityCoordinatorEmail,  IGraphServicePlacesCollectionPage allrooms)
        {
            string coordinatorEmail = activityCoordinatorEmail.EndsWith(GraphHelper.GetEEMServiceAccount().Split('@')[1]) ? activityCoordinatorEmail : GraphHelper.GetEEMServiceAccount();
            string location = primaryLocation;

            if (string.IsNullOrEmpty(eventLookup))
            {
                return primaryLocation;
            }

            Event evt;
            try
            {
                evt = await GraphHelper.GetEventAsync(coordinatorEmail, eventLookup);
            }
            catch (Exception)
            {
                evt = new Event();
                return primaryLocation;
            }

            List<string> rooms = new List<string>();
            if (evt != null && evt.Attendees != null)
            {
                foreach (var item in evt.Attendees)
                {
                    var room = allrooms.FirstOrDefault(x => x.AdditionalData["emailAddress"].ToString() == item.EmailAddress.Address);
                    if (room != null && !string.IsNullOrEmpty(room.DisplayName))
                    {
                        rooms.Add(room.DisplayName);
                    }
                }
            }

            if (rooms.Any())
            {
                location = string.Join(", ", rooms);
            }

            return location;
        }

    }
}