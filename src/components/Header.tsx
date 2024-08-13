import logo from "../assets/logo.png"

interface HeaderProps {
    score: number,
    highscore: number,
}


export const Header: React.FC<HeaderProps> = ({score, highscore, currentRound}) => {

    return (
        <>
        <div className='header-container'>
           <div className='header-title'>
             <img src={logo} alt="Pokey Logo" width="450px" />
           </div>
           <div className='header-body'>
            <div className='header-subtext'>
             <p>Earn 12 points to go to the next level. To win: do not to click the same card twice!</p>
            </div>
           <div className='header-score'>
            <p>Current Score: {score}</p>
            <p>Level: {highscore}</p>
           </div>
           </div>
        </div>
        </>
    )
}