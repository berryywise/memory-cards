import { useState, useEffect } from 'react'
import logo from "../assets/logo.png"
import pokemongo from "../assets/pokemongo.gif"

export default function CardGame() {

    const [score, setScore] = useState<number>(0);
    const [highscore, setHighscore] = useState<number>(0);
    const [currentRound, setCurrentRound] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(true);

    const Header = () => {

        return (
            <>
            <div className='header-container'>
               <div className='header-title'>
                 <img src={logo} alt="Pokey Logo" width="450px" />
               </div>
               <div className='header-body'>
                <div className='header-subtext'>
                 <p>Earn points by clicking the cards. To win: do not to click the same card twice!</p>
                </div>
               <div className='header-score'>
                <p>Current Score: {score}</p>
                <p>Highscore: {highscore}</p>
                <p>Current Round: {score}</p>
               </div>
               </div>
            </div>
            </>
        )
    }

    const genRandomNumber = () => {
        return Math.floor(Math.random() * (700 - 1 + 1)) //TODO: fix double numbers in array
    }

    const genRandomArray = () => {
        return Array.from({length: 12}, () => genRandomNumber());
    }


    const MemoryCards = () => {

        interface Pokemon {
            name: string,
            imageUrl: string,
        }

        const [cards, setCards] = useState<Pokemon[]>([])
        const [pokeys, setPokeys] = useState<number[]>([])
        const [loading, setLoading] = useState<boolean>(false);

        const handleClick = (index: number) => {

            const shuffledArray = [...cards].sort(() => 0.5 - Math.random())

            setCards(shuffledArray)

        }

        //Generates a random amount of integers, and sets the state according.
        useEffect(() => {
            
            const pokeyId = genRandomArray()
            setPokeys(pokeyId)

        }, [])

        //Fetches 12 random pokemons from API with the generated numbers.
        useEffect(() => {

            if(pokeys.length === 0) return;

            setLoading(true);

            const controller = new AbortController();
            const signal = controller.signal

            async function fetchPokemons() {

                try {
                  const fetchPromises = pokeys.map(async (id) => {

                      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {signal})
                      if(!response.ok) {
                           throw new Error(`Server responded with ${response.status} code.`)
                      }
                        const json = await response.json()
                        const image = json.sprites.other["official-artwork"].front_shiny;
                        return { imageUrl: image, name: json.name};
                  })

                  const pokeyData = await Promise.all(fetchPromises)
                  setCards(pokeyData)
                  setLoading(false);
                  
                } catch (error: unknown) {
                    if(error instanceof Error && error.name !== "AbortError" ) {
                        console.log(error)
                    }
                } 
            }
            
            fetchPokemons();
            
            return () => {
                controller.abort()
            }
        }, [pokeys])  
        
        return (
            <>
            <div className='memory-container'>
                {loading && <img src={pokemongo} alt='loading image'></img>}
                {cards.map((card, index) => (
                    <div key={index} onClick={() => handleClick(index)} className='card-container'>
                        <img src={card.imageUrl} alt={card.name} width="280px" />
                        <p>{card.name[0].toLocaleUpperCase() + card.name.slice(1)}</p>
                    </div>
                ))}
            </div>
            </>
        )
    }



  return (
    <>
     <Header />
     <MemoryCards />
    </>
  )
}
