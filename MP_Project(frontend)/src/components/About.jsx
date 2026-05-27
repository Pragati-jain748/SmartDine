import React from 'react'
import { Link } from 'react-scroll'
import {HiOutlineArrowNarrowRight} from 'react-icons/hi'

const About = () => {
  return (
    <section className='about' id='about'>
         <div className="container">
            <div className="banner">
                <div className="top">
                    <h1 className="heading">ABOUT US</h1>
                    <p>The only thing we're serious about is food.</p>
                </div>
                <p className='mid'>
                    At SmartDine, we believe that great food brings people together. Our passionate chefs craft every dish using the freshest, locally sourced ingredients to deliver an unforgettable dining experience. From classic comfort food to bold, innovative flavors — every plate tells a story of dedication, creativity, and love for culinary art.
                </p>
                <Link to={"/"}>
                  Explore Menu{" "} 
                   <span>
                      <HiOutlineArrowNarrowRight/>
                   </span>
                </Link>
            </div>
            <div className="banner">
                <img src="/about.png" alt="about" />
            </div>
         </div>
    </section>
  )
}

export default About
