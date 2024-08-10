import { useState, useEffect } from 'react'
import logo from "../assets/logo.png"

export default function CardGame() {

    const [score, setScore] = useState<number>(0);
    const [highscore, setHighscore] = useState<number>(0);

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
               </div>
               </div>
            </div>
            </>
        )
    }

    const MemoryCards = () => {


        interface Pokemon {
            name: string,
            imageUrl: string,
        }

        const [cards, setCards] = useState<Pokemon[]>([])

        useEffect(() => {

           const pokeyId = [5, 8, 10, 15, 25];


            const controller = new AbortController();
            const signal = controller.signal

            async function fetchPokemons() {

                try {
                  const fetchPromises = pokeyId.map(async (id) => {

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
        },[])  
        
        console.log(cards)
        
        return (
            <>
            <div className='memory-container'>
                {cards.map((card, index) => (
                    <div key={index} className='card-container'>
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
