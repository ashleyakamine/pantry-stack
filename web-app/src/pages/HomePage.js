import React from 'react';
import "../styles/homepage.css";


export function HomePage() {

  return (
    <>
    <div class="PLU">
      <img src={process.env.PUBLIC_URL + '/home.png'} alt="PLU Pantry" width={500}></img>
    </div>

    <div class="about">
      <h2>About the Pantry</h2>
      <p>
      Opperated by campus ministries, the PLU Pantry serves as a place for any students, staff, and faculty seeking assistance with any level of   
      food insecurity. The pantry offers a variety of foods provided through a partnership with Northwest Harvest. All you need is 
      your ID card to gain access to our stock of staples, fresh produce, and more. Beyond providing sustenance, the PLU Pantry fosters 
      a sense of belonging and care, creating a supportive environment where no one goes hungry. Whether you need a quick snack or face 
      more significant challenges, the pantry is ready to lend a helping hand to every member of our community.
      </p>
    </div>

    <div class="group">

      <div class="pic" id="one">
        <img src={process.env.PUBLIC_URL + '/stock.png'} alt="PLU Pantry" height="300"></img>
      </div>

      <div class="ours">
        <h2>What does this site do?</h2>
        <p>
          <strong>INVENTORY:</strong> On the inventory tab, you can find a list of the current inventory of the pantry to help you find 
          the food you need. You can search throught the current stock as well as view the number of items and the last stock date. <br></br><br></br>
          <strong>RECIPE:</strong> On the recipe tab, you can find a collection of recipes you can use as inspiration for finding what to cook with the 
          ingredients you have on hand. The recipes can be searched through by ingredient to help you narrow down the options.
        </p>
      </div>
    </div>


    <div class="group2">
      <div class="mission">
          <h2>The Pantry's Mission</h2>
          <p>
          The PLU Pantry exists as a resource to serve students, staff, and faculty 
          who are experiencing food insecurity in any way.
          </p>
        </div>

      <div class="location">
        <h2>Location</h2>
        <p>
        The PLU Pantry is located on the first floor of the AUC inside of Campus Ministry in room 190.
        </p>
      </div>

      <div class="more">
        <h2>Learn More!</h2>
        <p>
          Click here for more information:&ensp;
          <a href="https://www.plu.edu/wsr/plu-pantry/">PLU Pantry Official Website</a>
        </p>
      </div>
      <div class="pic" id="two">
          <img src={process.env.PUBLIC_URL + '/home2.png'} alt="PLU Pantry" height="500"></img>
      </div>
    </div>
    </>
  );
}