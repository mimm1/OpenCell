using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OpenCell.Models;

namespace OpenCell.Controllers
{
    public class HomeController : Controller

    {
        private OpencellidEntities db = new OpencellidEntities();

        //
        // GET: /OpenCell/

           public ActionResult Index()
        {
            var model = db.Opencells
                .OrderByDescending(r => r.ID)
                .Where(x => x.ID <= 10);
            return View(model.ToList());
              
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
