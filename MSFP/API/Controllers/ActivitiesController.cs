using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseAPIController
    {
        private readonly IMediator _mediator;
        public ActivitiesController(IMediator mediator) { 
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities() => await _mediator.Send(new List.Query());

        [HttpGet("geEventsByDate")]
        public async Task<ActionResult<List<FullCalendarEventDTO>>>GeEventsByDate()
        {
            string start = Request.Query["start"];
            string end = Request.Query["end"];
            return await _mediator.Send(new GetEventsByDate.Query { Start = start, End = end });
        }

    }
}
