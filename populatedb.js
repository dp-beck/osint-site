#! /usr/bin/env node

console.log(
    'This script populates some test jurisdictions, sources, and genres to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Source = require("./models/source");
  const Jurisdiction = require("./models/jurisdiction");
  const Category = require("./models/category");
  
  const categories = [];
  const jurisdictions = [];
  const sources = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createJurisdictions();
    await createSources();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name) {
    const category = new Category({ name: name });
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  }
  
  async function jurisdictionCreate(index, name, subjurisdictions) {
    const jurisdictiondetail = {
      name: name,
      subjurisdictions: subjurisdictions,
    };

    const jurisdiction = new Jurisdiction(jurisdictiondetail);
    await jurisdiction.save();
    jurisdictions[index] = jurisdiction;
    console.log(`Added jurisdiction: ${name}`);
  }
  
  async function sourceCreate(index, name, description, comments, jurisdiction, category, externalUrl) {
    const sourcedetail = {
      name: name,
      description: description,
      comments: comments,
      jurisdiction: jurisdiction,
      category: category,
      externalUrl: externalUrl
    };
    if (category != false) sourcedetail.category = category;
  
    const source = new Source(sourcedetail);
    await source.save();
    sources[index] = source;
    console.log(`Added source: ${name}`);
  }
  
 
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate(0, "Corporate Registration"),
      categoryCreate(1, "Upper Civil Court"),
      categoryCreate(2, "Lower Civil Court"),
      categoryCreate(3, "Upper Criminal Court"),
      categoryCreate(4, "Lower Criminal Court"),
      categoryCreate(5, "Judgments"),
      categoryCreate(6, "Liens")
    ]);
  }
  
  async function createJurisdictions() {
    console.log("Adding jurisdictions");
    await Promise.all([
      jurisdictionCreate(0, "Miami-Dade County"),      
      jurisdictionCreate(1, "New York County"),
      jurisdictionCreate(2, "Suffolk County"),
    ]);

    await Promise.all([
      jurisdictionCreate(3, "New York State", [jurisdictions[1], jurisdictions[2]] ),
      jurisdictionCreate(4, "Florida State", [jurisdictions[0]] ),
    ]);

    await jurisdictionCreate(5, "United States of America", [jurisdictions[3], jurisdictions[4]] );
  }
  
  async function createSources() {
    console.log("Adding Sources");
    await Promise.all([
      sourceCreate(0,
        "Florida Department of State",
        "The Florida Department of State provides access to corporate registrations, fictitious business names, judgment-liens, and federal liens",
        "These searches are all free. You can search by registered agent/principal name.",
        jurisdictions[4],
        [categories[0], categories[5], categories[6]],
        "https://dos.fl.gov/sunbiz/search/"
      ),
      sourceCreate(1,
        "New York Department of State",
        "The NY Department of State provides access to corporate registrations.",
        `The searches are free, but information is limited. No person search is available.`,
        jurisdictions[3],
        [categories[0]],
        "https://apps.dos.ny.gov/publicInquiry/"
      ),
      sourceCreate(2,
        "Miami-Dade Clerk of the Court and Comptroller",
        "The Miami-Dade Clerk allows you to search for civil, family, and probate court records",
        "The searches are free.",
        jurisdictions[0],
        [categories[1], categories[2]],
        "https://www2.miamidadeclerk.gov/ocs/?AspxAutoDetectCookieSupport=1"
      ),
      sourceCreate(3,
        "Suffolk County Clerk",
        "The Suffolk County Clerk enables searches of judgments, liens, UCCs and other land records",
        "The searches are free.",
        jurisdictions[2],
        [categories[5], categories[6]],
        "https://clerk.suffolkcountyny.gov/kiosk/SearchPages/MainSearch.aspx"
      ),
    ]);
  }
  
  