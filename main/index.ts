import fetch from "node-fetch";
import * as Web from "webwebweb";
import * as appInsights from "applicationinsights";

// NOTE TO READER: To keep this key out of commited source code,
//    provide this key via an environment variable.
const appInsightsKey = "188131df-ecb9-4a26-be1a-1e3967ab14eb";
appInsights.setup( appInsightsKey );
appInsights.start();

Web.APIs[ "/jobs" ] = async ( qs, body, opts ) => {
    let jobs = await fetch( `http://localhost:8081/search?text=${qs.text}` )
        .then( r => r.json() );
    return jobs;
};
Web.Run( 8080 );
