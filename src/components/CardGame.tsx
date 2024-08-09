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
                 <img src={logo} alt="Pokey Logo" width="600px" />
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

        const [pokeyId, setPokeyId] = useState<number>(50)

        interface Pokemon {
            id?: number,
            name?: string,
            description?: string,
            firstColor?: string,
            secondColor?: string,
            imageUrl: string,
        }

        const [cards, setCards] = useState<Pokemon>({
            id: 0,
            name: "",
            description: "",
            firstColor: "",
            secondColor: "",
            imageUrl: "",
        })

        useEffect(() => {

            const controller = new AbortController();

            async function fetchPokemons() {
                if(!pokeyId) return;
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeyId}`, {signal: controller.signal})
                    if(!response.ok) {
                         console.log(`Server responded with ${response.status} code.`)
                         return;
                    }
                      const json = await response.json()
                      const image = json.sprites.other["official-artwork"].front_shiny;
                      setCards(previousCards => ({...previousCards, imageUrl: image}))
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
        }, [pokeyId])


        return (
            <>
            <div className='memory-container'>
                <input type="text" name='id' onChange={e => setPokeyId(Number(e.target.value))} />
                <img src={cards.imageUrl} alt="Pokemon Image" width="150px" />
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
