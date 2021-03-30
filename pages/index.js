import { useState, useEffect } from 'react'
import Head from 'next/head'
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getAllTimezones } from './api/timezones'
import TimezoneCard from '../components/TimezoneCard'

export default function Home(props) {
  const { timezones } = props
  const [userTimezones, setUserTimezones] = useState([])

  useEffect(() => {
    // Check if it's on the client side
    if (typeof localStorage !== 'undefined') {
      setUserTimezones(JSON.parse(localStorage.getItem('userTimezones')) || [])
    }
  }, [])

  function removeTimezone(timezone) {
    const newTimezones = [...userTimezones]
    const indexToRemove = userTimezones.indexOf(timezone)
    newTimezones.splice(indexToRemove, 1)
    if (userTimezones.length === 1) {
      localStorage.removeItem('userTimezones')
    } else {
      localStorage.setItem('userTimezones', JSON.stringify(newTimezones))
    }
    setUserTimezones(newTimezones)
  }

  function handleChange(e, value) {
    if (value !== null && !userTimezones.includes(value)) {
      const newTimezones = [...userTimezones, value]
      localStorage.setItem('userTimezones', JSON.stringify(newTimezones))
      setUserTimezones(newTimezones)
    }
  }

  function createNewTimeBox(timezone) {
    return <TimezoneCard key={timezone} timezone={timezone} removeTimezone={removeTimezone} />
  }

  return (
    <Container maxWidth='sm' style={{ paddingTop: '8rem' }}>
      <Head>
        <title>World Clock</title>
        <meta name='description' content='Free World clock' />
        <meta name='author' content='Santiago Lorenzo' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      </Head>

      <main>
        <Autocomplete
          blurOnSelect
          autoHighlight
          options={timezones}
          onChange={handleChange}
          style={{ marginBottom: '3rem' }}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              placeholder='select a country'
              style={{
                borderRadius: '4px',
                backgroundColor: '#ebebeb'
              }}
            />
          )}
        />
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-between'
          }}
        >
          {userTimezones.length > 0 && userTimezones.map(createNewTimeBox)}
        </div>
      </main>
    </Container>
  )
}

export async function getStaticProps() {
  const timezones = (await getAllTimezones()) || []

  return {
    props: { timezones },
  }
}