import {test, expect } from '@playwright/test'
import { link } from 'node:fs';
import path from 'node:path';
import os from 'os';

test.beforeEach(async ({page}) =>{
    await page.goto('https://omayo.blogspot.com/');
});

//getting page title
test('page title capture', async({page}) =>{
    await page.goto('https://omayo.blogspot.com/');
    const title = await page.title();
    expect(title).toBe('omayo (QAFox.com)');
    console.log(title);
});
//creating new browser cotext
test('new browser context', async({browser}) =>{
    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto("https://arth-fin-ser-admin.vercel.app/employee");
    const title = await page1.title();
    console.log(title);
    await page1.pause();
});
//multi selection box
test('multi selection box', async({page}) =>{
    const options = await page.locator('#multiselect1 option').all(); // .all will convert into array
    await page.keyboard.down('Control');
    // await Promise.all(options.map(option => option.click())); // click all option at a time
    console.log(`option count are: ${options}`);
    for(const option of options){        //clicking all options one by one
        await option.click();
    }
    await page.keyboard.up('Control');
    await page.pause();
})
//single select
test('dropdown selection', async({page}) =>{
    await page.locator('#drop1').selectOption('mno');
    await page.pause();
});
//get text and print it
test('para text collection',async({page}) =>{
    const para1 = await page.locator('#Text1 .widget-content').innerText();
    console.log(para1);
    await page.pause();

});
//click on the link
test('different way to click on the link', async({page}) =>{
    // await page.locator('#link1').click();
    // await page.locator('#HTML3 #link1').click();
    // await page.locator('a[value="link1"]').click();
    // Locate by its visible link text
    // await page.getByRole('link', { name: 'Selenium143' }).nth(2).click();
    // await page.locator('#HTML3 > div > a').click();
    await page.locator('//a[@id="link1"]').click();
    await page.waitForLoadState('networkidle')
    console.log(await page.title());
    await page.pause();
});
//select text box form preloaded text
test('select and fill text in textbox', async({page}) =>{
    const text = "hii helloooo welcomeeeeee";
    await page.locator('input[value="Selenium WebDriver"]').fill(text);
    await page.pause();
});
//click with the refrence of near element
test('click with refrence go to next tab then close it', async({page, context}) =>{
    console.log(await page.title());
    const pagePromise = context.waitForEvent('page');
    await page.locator("#HTML5").getByRole('link', {name: 'SeleniumTutorial'}).click();
    const newPage = await pagePromise;
    console.log(await newPage.title());
    await newPage.waitForTimeout(5000);
    await newPage.close();
    console.log(await page.title());
    await page.pause()
});
test('select using xpath and container filtering', async({page}) =>{
    // await page.locator(".widget").filter({hasText:'Enabled Button'}).getByRole('button',{name: 'Button2'}).click();
    await page.locator('//h2[text()="Enabled Button"]/following-sibling::div/button').click();
    await page.pause();
});
test('select button if visible', async({page}) =>{
    const button = await page.locator('//h2[text()="Disabled Button"]/following-sibling::div/button').isDisabled();
    console.log(button);
    await page.pause();
});
test('select input if visible', async({page}) =>{
    const input = await page.locator('//h2[text()="Disabled Text Box"]/following-sibling::div/input').isDisabled();
    console.log(input);
    await page.pause();
});
test('click on button with same name', async({page}) =>{
    const button = await page.locator('//h2[text()="Buttons with same name attribute values"]/following-sibling::div/button[text()="Submit"]').click();
    await page.pause();
});
test('print items of ordered list', async({page}) =>{
    const list = await page.locator('.widget').filter({hasText:'Ordered List'}).locator('ul').getByRole('listitem');
    for(let i = 0; i< await list.count(); i++){
        console.log(await list.nth(i).innerText());
    }
    await page.pause();
});
test("click after text disspear", async({page}) =>{
    test.setTimeout(40 * 1000);
    page.on('dialog', async dialog =>{
        console.log(`Alert message ${dialog.message()}`);
        await page.waitForTimeout(2000);
        await dialog.accept();
    })
    await page.locator('#deletesuccess').waitFor({state:'hidden'});
    await page.locator('#alert2').click();
    await page.pause();
});
test("get the text after visible", async({page}) =>{
    await page.locator("#delayedText").waitFor({state:"visible"});
    const text = await page.locator('#delayedText').innerText();
    console.log(text);
    await page.pause();
});
test("handel pop up window", async({page}) =>{
    const popupPromise = page.waitForEvent('popup');
    // await page.locator('a[href*="JavaScript:newPopup"]').click();
    await page.getByRole('link', {name:'Open a popup window'}).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    console.log(await popup.locator('.example').innerText());
    await popup.waitForTimeout(3000);
    await popup.close();
    console.log(await page.title());
})
test("handel file uploading", async({page}) =>{
    const homeDir = os.homedir();
    const filePath = path.join(homeDir,'Downloads','Web+address.txt');
    // const filePath = "C:\\Users\\priyekum\\OneDrive - Capgemini\\Documents\\Testing Concepts 5\\PDFs\\Testing Concepts-ClassBook-Lesson01.pdf"
    await page.locator('#uploadfile').setInputFiles(filePath);
    await page.waitForTimeout(5000);
    await expect(page.locator('#uploadfile')).toHaveValue(/Web\+address.txt/);
});
test("double clicking on button", async({page}) =>{
    await page.waitForTimeout(4000);
    page.on('dialog', async dialog =>{
        console.log(`Alert message caught: ${dialog.message()}`);
        await page.waitForTimeout(4000);
        await dialog.accept();
    });
    await page.getByRole('button',{name: "Double click Here"}).dblclick();
    await page.waitForTimeout(4000);
    await page.pause();
});
test("click checkbox when visible", async({page}) =>{
    await page.locator('.widget').filter({hasText:'Mr Option:'}).locator('button').click();
    await page.locator('#dte').waitFor({state:'visible'});
    await page.locator('#dte').check();
    await page.pause();
});
test('Text Area Field', async({page}) =>{
    const text = await page.locator('#Text1').innerText();
    await page.locator('#ta1').fill(`this is copyed text: \n\n${text}`);
    await page.pause();
});
test('Text area with pretext', async({page}) =>{
    const text  = await page.locator('#HTML11').locator('textarea').pressSequentially('#The cat was playing in the garden.#');
    await page.pause();
})