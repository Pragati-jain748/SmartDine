import React, { useState, useEffect } from 'react'
import { Link , useNavigate } from 'react-router-dom';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const Success = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if(prevCountdown === 1){
          clearInterval(timeoutId);
          navigate("/");
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(timeoutId);
  }, [navigate]);

  return (
    <section className='notFound'>
      <div className="container">
        <h2 style={{ fontSize: '2rem', fontWeight: '500', color: '#111', marginBottom: '1.5rem', letterSpacing: '1px' }}>Your Reservation is successfully Completed!</h2>
        <img src="/sandwich.png" alt="success" />
        <h1>Redirecting to Home in {countdown} seconds...</h1>
        <Link to="/">Return to Home
        <span><HiOutlineArrowNarrowRight /></span>
        </Link>
      </div>
    </section>
  )
}

export default Success
