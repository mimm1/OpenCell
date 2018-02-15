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
    public class OpenCellController : Controller
    {
        private OpencellidEntities db = new OpencellidEntities();

        //
        // GET: /OpenCell/

        public ActionResult Index()
        {

            return View(db.Opencells.Where(x=>x.ID<=10).ToList());
        }

        //
        // GET: /OpenCell/Details/5

        public ActionResult Details(int id = 0)
        {
            Opencell opencell = db.Opencells.Find(id);
            if (opencell == null)
            {
                return HttpNotFound();
            }
            return View(opencell);
        }

        //
        // GET: /OpenCell/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /OpenCell/Create

        [HttpPost]
       // [ValidateAntiForgeryToken]
        public ActionResult Create(Opencell opencell)
        {
            if (ModelState.IsValid)
            {
                db.Opencells.Add(opencell);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(opencell);
        }

        //
        // GET: /OpenCell/Edit/5

        public ActionResult Edit(int id = 0)
        {
            Opencell opencell = db.Opencells.Find(id);
            if (opencell == null)
            {
                return HttpNotFound();
            }
            return View(opencell);
        }

        //
        // POST: /OpenCell/Edit/5

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public ActionResult Edit(Opencell opencell)
        {
            if (ModelState.IsValid)
            {
                db.Entry(opencell).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(opencell);
        }

        //
        // GET: /OpenCell/Delete/5

        public ActionResult Delete(int id = 0)
        {
            Opencell opencell = db.Opencells.Find(id);
            if (opencell == null)
            {
                return HttpNotFound();
            }
            return View(opencell);
        }

        //
        // POST: /OpenCell/Delete/5

        [HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Opencell opencell = db.Opencells.Find(id);
            db.Opencells.Remove(opencell);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}