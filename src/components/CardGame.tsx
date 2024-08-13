import { useState, useEffect } from 'react'
import pokemongo from "../assets/pokemongo.gif"
import {Header} from './Header';



interface MemoryProps {
    score: number,
    highscore: number,
    clickedCards: string[]
    setScore: React.Dispatch<React.SetStateAction<number>>,
    setClickedCards: React.Dispatch<React.SetStateAction<string[]>>, 
    setHighscore: React.Dispatch<React.SetStateAction<number>>,
}

const MemoryCards: React.FC<MemoryProps> = ({score, highscore, clickedCards, setScore, setClickedCards, setHighscore}) => {

    interface Pokemon {
        name: string,
        imageUrl: string,
    }

    const [cards, setCards] = useState<Pokemon[]>([])
    const [pokeys, setPokeys] = useState<number[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("")

    //TODO: on second card, check for previous card in array ? if name is in array, fail game, else continue
    //TODO: when user reacher score of 12, end game. show win message, show next round, fetch new pokeys, update round from 1 > 2,


    //Shuffles the cards and executes game logic
    const handleClick = (index: number) => {

        const shuffledArray = [...cards].sort(() => 0.5 - Math.random())

        setCards(shuffledArray)
        handleGame(cards[index].name)


    }

    const handleGame = (index: string) => {

        if(clickedCards.includes(index)) {
            resetGame();
            setError("Game Over! Try again :)")
            return;
        }
            
        setMessage("")
        setError("")
        setScore(score + 1);
        setClickedCards([...clickedCards, index])

        if(score === 12) {
            setHighscore(highscore + 1);
            setMessage("Congratulations, you finished the current level!")
            resetGame();
        }

    }

    const resetGame = () => {
        setScore(0)
        setClickedCards([])
        setCards([])
        setPokeys(genRandomArray());
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
        {message && <p style={{color: "#ffcb05", fontWeight: "bold", textAlign: "center"}} >{message}</p>}
        {error && <p style={{color: "red", fontWeight: "bold", textAlign: "center"}} >{error}</p>}
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

export default function CardGame() {

    const [score, setScore] = useState<number>(0);
    const [highscore, setHighscore] = useState<number>(1);
    const [clickedCards, setClickedCards] = useState<string[]>([])

    
  return (
    <>
     <Header score={score} highscore={highscore}/>
     <MemoryCards score={score} highscore={highscore} clickedCards={clickedCards} setScore={setScore} setHighscore={setHighscore} setClickedCards={setClickedCards} />
    </>
  )
}

const genRandomNumber = () => {
    return Math.floor(Math.random() * (700 - 1 + 1)) //TODO: fix double numbers in array
}

const genRandomArray = () => {
    return Array.from({length: 12}, () => genRandomNumber());
}



