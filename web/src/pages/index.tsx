
import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import LogoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [ poolTitle, setPoolTitle ] = useState('')


  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const responde = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = responde.data

      await navigator.clipboard.writeText(code)

      alert('Seu código do bolão foi copiado para a área de transferência!')

      setPoolTitle('')
    } catch (error) {
      alert('Erro ao criar bolão')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center">
      <main>
        <Image className='pt-5' src={LogoImg} alt="NLW Copa" quality={100} />

        <h1 className="m-5 text-5xl font-bold leading-tight"> 
            Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" quality={100} />

          <strong className="text-gray-700 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas já estão participando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input 
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-yellow-500 text-sm text-gray-100'
            type="text" 
            required 
            placeholder="Qual o nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)} 
            value={poolTitle}
          />
          <button
            className='bg-yellow-500 px-6 py-4 rouded text-gray-900 font-bold text-sm rounded uppercase hover:bg-yellow-700' 
            type="submit"
            >
            Criar meu bolão
          </button>
        </form>

        <p 
          className='mt-4 text-sm text-gray-800 leading-relaxed'
        >
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀  
        </p>

        <div className='mt-10 pt-1 border-t border-gray-600 flex items-center justify-between text-gray-800' >
          <div className='flex items-center gap-3'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolão criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-3'>
          <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImg} alt="Dois celulares" quality={100}/>
    </div>
   
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),

  ])
  
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}


