const puppeteer = require('puppeteer');
const shell = require('shelljs');

const slackTeamName = process.env.SLACK_TEAM_NAME;
const slackUserName = process.env.SLACK_USER_NAME;
const slackPassword = process.env.SLACK_PASSWORD;
const slackAppId = "A016J10PDQF"
const slackEventsUrl = shell.exec('./print-ngrok-url', {silent: true}).stdout;
console.log("Found ngrok url... " + slackEventsUrl);

(async () => {

    function delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://slack.com/signin?from_get_started=1');
    await page.setViewport({width: 1200, height: 800});

    await page.waitForSelector('[data-qa="signin_domain_input"]');
    await page.click('[data-qa="signin_domain_input"]');
    await page.type('[data-qa="signin_domain_input"]', slackTeamName);

    await page.waitForSelector('[data-qa="submit_team_domain_button"]');
    await page.click('[data-qa="submit_team_domain_button"]');

    await page.waitForSelector('[data-qa="login_email"]');
    await page.click('[data-qa="login_email"]');
    await page.type('[data-qa="login_email"]', slackUserName);

    await page.waitForSelector('[data-qa="login_password"]');
    await page.click('[data-qa="login_email"]');
    await page.type('[data-qa="login_password"]', slackPassword);

    await page.waitForSelector('[data-qa="signin_button"]');
    await page.click('[data-qa="signin_button"]');

    await delay(5000)
    await page.goto('https://api.slack.com/apps/' + slackAppId + '/event-subscriptions?');
    await page.setViewport({width: 1200, height: 800});

    await page.waitForSelector('#change_request_url');
    await page.click('#change_request_url');

    await page.waitForSelector('[data-qa="event_request_url"]');
    await page.click('[data-qa="event_request_url"]');
    await page.type('[data-qa="event_request_url"]', slackEventsUrl + '/slack/events');

    //await page.waitForSelector('#retry_url_verification');
    //await page.click('#retry_url_verification');

    await delay(5000)
    await page.screenshot({path: 'slack-screenshot.png'});

    /*
    await page.waitForSelector('#signup');
    await page.click('#signup');
    
    await page.waitForSelector('#s-name');
    await page.click('#s-name');
    
    await page.type('#s-name', 'John');
    await page.type('#s-surname', 'Doe');
    await page.type('#s-email', process.env.USER_EMAIL);
    await page.type('#s-password2', process.env.USER_PASSWORD);
    await page.type('#s-company', 'John Doe Inc.');
    
    await page.waitForSelector('#business');
    await page.click('#business');
    
    await page.waitForSelector('#marketing-agreement');
    await page.click('#marketing-agreement');
    
    await page.waitForSelector('#privacy-policy');
    await page.click('#privacy-policy');
    
    await page.waitForSelector('#register-btn');
    await page.click('#register-btn');
    
    await page.waitForSelector('#login-message', { visible: true });
    
    */
    await browser.close();
})()
