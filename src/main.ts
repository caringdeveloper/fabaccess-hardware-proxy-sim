// Importing all Controllers here, otherwise tsoa is not able to find them
// and is not able to build routes and swagger definitions for us.
import "reflect-metadata";
import "./1 - REST Interface/Controllers/HardwareProxyController";

// @ts-ignore
import { RegisterRoutes } from "./routes";
import { RegisterServices } from "./registerServices";
import RequestLogger from "./1 - REST Interface/Middleware/RequestLogger";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

// Retrieving the path of swagger-ui
const swaggerUiPath = require("swagger-ui-dist").absolutePath();

const { APPLICATION_PORT } = process.env;

(async () => {
  // First we make sure we can connect to the database
  // await createConnection();
  await RegisterServices();

  // Then we can start our express web server
  const app = express();

  // Log all request to this API
  app.use(RequestLogger);

  // Standard middleware
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));

  // Routing static content via middleware
  app.use("/v1/images", express.static("public"));

  // Only show Swagger if server is in development mode
  if (process.env.NODE_ENV !== "production") {
    // Swagger definition files
    app.use("/definitions/", express.static("definitions"));

    // Make swagger-ui available
    app.use("/swagger-ui", express.static(swaggerUiPath));

    // Redirect to API definition for the developer
    app.get("/swagger", (req: express.Request, res: express.Response) => {
      res.redirect("/swagger-ui/?url=/definitions/swagger.json");
    });
  }

  // Let TSOA register the controllers
  RegisterRoutes(app);

  // Error handling
  app.use(
    (err: any, req: express.Request, res: express.Response, next: any) => {
      if (err.status && err.status === 401) {
        // Not authorized or authenticated - Return info to user
        res.status(401).json(err);
      } else if (err.status && err.status === 400) {
        // The developer made an error. Return the error to the developer
        res.status(400).json(err);
      } else {
        // We fucked up - Only return HTTP 500 and log the error
        console.log("[ERROR]", "Internal error", err);
        res.status(500);
        res.end();
      }
    }
  );

  app.listen(APPLICATION_PORT || 4000, () =>
    console.log(`Service is listening on port ${APPLICATION_PORT || 4000}`)
  );
})();
