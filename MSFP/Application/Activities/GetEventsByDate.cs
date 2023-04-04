using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Persistence;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class GetEventsByDate
    {
        public class Query : IRequest<List<FullCalendarEventDTO>> 
        {
            public string Start { get; set; }
            public string End { get; set; }
        }
    public class Handler : IRequestHandler<Query, List<FullCalendarEventDTO>>
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;

            public Handler(DataContext context, IConfiguration config)
        {
            _context = context;
           _config = config;
            }

        public async Task<List<FullCalendarEventDTO>> Handle(Query request, CancellationToken cancellationToken)
        {
                Settings s = new Settings();
                var settings = s.LoadSettings(_config);
                GraphHelper.InitializeGraph(settings, (info, cancel) => Task.FromResult(0));
                var allrooms = await GraphHelper.GetRoomsAsync();

                DateTime start = GetDateTimeFromRequest(request.Start);
                DateTime end = GetDateTimeFromRequest(request.End);
                var activities = await _context.Activities .Include(x => x.Organization).Where(x => x.MFP)
                      .Where(x => !x.LogicalDeleteInd)
                      .Where(
                                         x =>
                                            (x.Start <= start && x.End <= end) ||
                                            (x.Start >= start && x.End <= end) ||
                                            (x.Start <= end && x.End >= end) ||
                                            (x.Start <= start && x.End >= end)
                                   )
                    .ToListAsync();

                List<FullCalendarEventDTO> fullCalendarEventDTOs = new List<FullCalendarEventDTO>();

                foreach (var activity in activities)
                {
                    DateTime endDateForCalendar = activity.AllDayEvent ? activity.End.AddDays(1) : activity.End;
                    FullCalendarEventDTO fullCalendarEventDTO = new FullCalendarEventDTO
                    {
                        Id = activity.Id.ToString(),
                        Title = activity.Title,
                        Start = GetStringFromDateTime(activity.Start, activity.AllDayEvent),
                        End = GetStringFromDateTime(endDateForCalendar, activity.AllDayEvent),
                        AllDay = activity.AllDayEvent,
                        Description = activity.Description,
                        PrimaryLocation = await GetLocation(activity.PrimaryLocation, activity.EventLookup, activity.CoordinatorEmail, allrooms),
                        LeadOrg = activity.Organization?.Name,
                        ActionOfficer = activity.ActionOfficer,
                        ActionOfficerPhone = activity.ActionOfficerPhone,
                        EventLookup = activity.EventLookup,
                        CoordinatorEmail = activity.CoordinatorEmail,
                        Color=GetColor(activity.EducationalCategory),
                        EducationalCategory= activity.EducationalCategory
                    };

                    fullCalendarEventDTOs.Add(fullCalendarEventDTO);
                }
                return fullCalendarEventDTOs;
            }

            private string GetColor(string educationalCategory)
            {
                switch (educationalCategory)
                {
                    case "Leadership & Readiness":
                        return "#394f02";
                    case "Personal Finance Management":
                        return "#060963";
                    case "Personal Growth and Fitness":
                        return "#8f032f";
                    case "Family Growth & Resiliency":
                        return "#22663d";
                    case "TS-SCI":
                        return "#ad5003";
                    default:
                        return "#124f75"; // Return a default color if no category matches
                }
            }

            private async Task<string> GetLocation(string primaryLocation, string eventLookup, string activityCoordinatorEmail, IGraphServicePlacesCollectionPage allrooms)
            {
                string location = primaryLocation;
                if (!string.IsNullOrEmpty(eventLookup) && !string.IsNullOrEmpty(activityCoordinatorEmail))
                {
                    string coordinatorEmail = activityCoordinatorEmail.EndsWith(GraphHelper.GetEEMServiceAccount().Split('@')[1])
                        ? activityCoordinatorEmail : GraphHelper.GetEEMServiceAccount();

                    Event evt;
                    try
                    {
                        evt = await GraphHelper.GetEventAsync(coordinatorEmail, eventLookup);
                    }
                    catch (Exception)
                    {                     
                        evt = new Event();
                    }
                    if (evt != null && evt.Attendees != null)
                    {
                        var allroomEmails = allrooms.Select(x => x.AdditionalData["emailAddress"].ToString()).ToList();
                        List<string> roomNames = new List<string>();
                        foreach (var item in evt.Attendees.Where(x => allroomEmails.Contains(x.EmailAddress.Address)))
                        {
                            var room = allrooms.Where(x => x.AdditionalData["emailAddress"].ToString() == item.EmailAddress.Address).FirstOrDefault();
                            if (room != null && !string.IsNullOrEmpty(room.DisplayName))
                            {
                                roomNames.Add(room.DisplayName);
                            }                      
                        }
                        if (roomNames.Any())
                        {
                            location = string.Join(", ", roomNames);
                        }
                    }
                }
                    return location;
            }

            private string GetStringFromDateTime(DateTime dateTime, bool allDayEvent)
            {
                string year = dateTime.Year.ToString();
                string month = dateTime.Month.ToString().PadLeft(2, '0');
                string day = dateTime.Day.ToString().PadLeft(2, '0');
                if (!allDayEvent)
                {
                    string hour = dateTime.Hour.ToString().PadLeft(2, '0');
                    string minute = dateTime.Minute.ToString().PadLeft(2, '0');
                    return ($"{year}-{month}-{day}T{hour}:{minute}:00");
                }
                else
                {
                    return ($"{year}-{month}-{day}");
                }
            }

            private DateTime GetDateTimeFromRequest(string dateAsString)
            {
                var myArray = dateAsString.Split('T');
                var dateArray = myArray[0].Split('-');
                var timeArray = myArray[1].Split(':');
                int year = Int32.Parse(dateArray[0]);
                int month = Int32.Parse(dateArray[1]);
                int day = Int32.Parse(dateArray[2]);
                int hour = Int32.Parse(timeArray[0]);
                int minute = Int32.Parse(timeArray[1]);
                DateTime dateTime = new DateTime(year, month, day, hour, minute, 0);
                return dateTime;
            }
        }
}
}
