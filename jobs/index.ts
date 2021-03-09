import fetch from "node-fetch";
import * as Web from "webwebweb";
import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics";

const textAnalyticsKey = "TEXT ANALYTICS API KEY";
const textAnalyticsEndpoint = "TEXT ANALYTICS ENDPOINT";
const textAnalyticsClient = new TextAnalyticsClient( textAnalyticsEndpoint,  new AzureKeyCredential( textAnalyticsKey ) );

const translationKey = "TRANSLATION API KEY";
const translationEndpoint = "TRANSLATION ENDPOINT";
const translationRegion = "TRANSLATION LOCATION";

async function translate( text, to ) {
    let translation = await fetch( `${translationEndpoint}translate?api-version=3.0&to=${to}`, {
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": translationKey,
            "Ocp-Apim-Subscription-Region": translationRegion,
            "Content-type": "application/json",
        },
        body: JSON.stringify([{
            "text": text
        }])
    } ).then( r => r.json() );
    return translation;
}

let jobs = [];
async function getLatestJobs() {
    jobs = await fetch( "https://jobs.github.com/positions.json" )
                .then( r => r.json() );
}
getLatestJobs();

setInterval( () => {
    getLatestJobs();
}, 60000 * 15 );

Web.APIs[ "/sentiment" ] = async ( qs, body, opts ) => {
    const sentiment = await textAnalyticsClient.analyzeSentiment( [ qs.text ] );
    return sentiment;
};

Web.APIs[ "/language" ] = async ( qs, body, opts ) => {
    const language = await textAnalyticsClient.detectLanguage( [ qs.text ] );
    return language;
};

Web.APIs[ "/phrase" ] = async ( qs, body, opts ) => {
    const phrases = await textAnalyticsClient.extractKeyPhrases( [ qs.text ] );
    return phrases;
};

Web.APIs[ "/translate" ] = async ( qs, body, opts ) => {
    const translation = await translate( qs.text, qs.to );
    return translation;
};

Web.APIs[ "/search" ] = ( qs, body, opts ) => {
    if( qs.text ) {
        let terms = qs.text.split( "," );
        return jobs.filter( x => terms.every( term => x.description.match( new RegExp( term, "i" ) ) ) );
    }
    else {
        return jobs;
    }
};
Web.Run( 8081 );
