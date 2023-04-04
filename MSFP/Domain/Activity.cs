using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
       public string Title { get; set; }
       public bool AllDayEvent { get; set; }
        public DateTime Start {get; set;}
        public DateTime End { get; set; }
        public string Description {get; set;}
         public string ActionOfficer { get; set; }
        public string ActionOfficerPhone { get; set; }
         public string PrimaryLocation { get; set; }
        [NotMapped]
        public string[] RoomEmails { get; set; }
        public string CoordinatorEmail { get; set; }

        public string CoordinatorDisplayName{ get; set; }

        public string EventLookup { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        public Guid? OrganizationId { get; set; }
        public Organization Organization { get; set; }
         public bool MFP { get; set; }
        public string EducationalCategory { get; set; }
        public bool LogicalDeleteInd {get; set;}
    }
}