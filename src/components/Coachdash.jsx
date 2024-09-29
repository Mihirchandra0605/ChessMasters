import React from 'react';
import Coachprofile from './Coachprofile.jsx';
import NavbarPlay from './navbarplay.jsx';
import styles from '../styles/Coachdash.module.css';

const Coachdash = () => {
    const profileData = {
        aboutMe: "I am a 26 year old National Master from Charlotte, North Carolina. I learned how to play chess at the age of 7 from my older brother and Dad, and I quickly fell in love with the game. I noticed from a young age that many players allow chess to fade out of their lives, so I made a point to stick with it. When I got to college in 2015, I was introduced to the online game and have been playing and working on my game ever since. I am currently a full-time student in Raleigh, NC, but I teach around 15 hours a week. I am young and passionate about the game, and I can guarantee that I will put forth the effort that is necessary for you to improve.",
        playingExperience: [
            "National Master title- September 2017",
            "State champion- November 2017"
        ],
        teachingExperience: [
            "Charlotte Chess Center 2018-2019",
            "Private lessons 2013-present",
            "Castle Chess Camp Counselor 2017, 2019"
        ],
        teachingMethodology: "Tactical understanding can be obtained on your own- but positional understanding cannot. I believe that an understanding of positional principles is a necessary foundation to become a successful chess player. My lessons will focus on learning from your games, whether they are your own or those that others have played, specifically focusing on knowledge which an engine or database may not be able to explain. Finding the correct plan in a position is where many players struggle, and this is what I focus on."
    };

    return (
        <div className="coachdash">
            <NavbarPlay />
            <Coachprofile />
            <div className={`${styles.profileSection}`}> 
                <div className={`${styles.aboutme}`}>
                    <h1>About Me</h1>
                    <p>{profileData.aboutMe}</p>
                </div>
                <div className={`${styles.playex}`}>
                    <h1>Playing Experience</h1>
                    <ul>
                        {profileData.playingExperience.map((item, index) => (
                            <li key={index} className={styles.noBullet}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.teachex}`}>
                    <h1>Teaching Experience</h1>
                    <ul>
                        {profileData.teachingExperience.map((item, index) => (
                            <li key={index} className={styles.noBullet}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.teachmethod}`}>
                    <h1>Teaching Methodology</h1>
                    <p>{profileData.teachingMethodology}</p>
                </div>
                <button className={`${styles.subscribe}`}>Subscribe</button>
            </div>
        </div>
    );
}

export default Coachdash;