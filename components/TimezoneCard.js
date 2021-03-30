import { useState, useEffect } from 'react'
import moment from 'moment'
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { getTimezone } from '../pages/api/timezones'

export default function TimezoneCard({ timezone, removeTimezone }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timezoneData, setTimezoneData] = useState({})

  async function getTimezoneData() {
    try {
      setLoading(true)
      const data = await getTimezone(timezone)
      const date = moment(data.datetime.split('T')[0]).format('L')
      const time = moment(data.datetime.split('T')[1].split('.')[0], 'HH:mm').format('LT')
      setTimezoneData({ timezone: data.timezone, time, date })
    } catch {
      setError('There was an error.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTimezoneData()
  }, [])

  return (
    <Card
      style={{
        display: 'flex',
        minWidth: '10rem',
        minHeight: '8.5rem',
        borderRadius: '1rem',
        marginBottom: '1rem',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#c5dcee',
        border: '1px solid #192028',
      }}
    >
      {loading ? (
        <CircularProgress style={{
          color: 'black',
          display: 'flex',
          alignSelf: 'center',
        }} />
      ) : (
        <>
          <CardHeader
            style={{ paddingBottom: '0px' }}
            action={
              <IconButton onClick={() => removeTimezone(timezone)} size='small' aria-label='Close'>
                <CloseOutlinedIcon />
              </IconButton>
            }
          />
          <CardContent
            style={{
              display: 'flex',
              paddingTop: '0',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {error !== '' ? (
              <>
                <Typography style={{ color: 'red', fontSize:'0.8rem' }}>{error}</Typography>
                <Button
                  onClick={getTimezoneData}
                  style={{
                    color: 'red',
                    marginTop: '0.5rem',
                    textDecoration: 'underline'
                  }}
                >
                  Try again
                </Button>
              </>
            ) : (
              <>
                <Typography style={{ fontWeight: 'bold' }}>{timezoneData.timezone}</Typography>
                <Typography>{timezoneData.date}</Typography>
                <Typography>{timezoneData.time}</Typography>
              </>
            )}
          </CardContent>
        </>
      )}
    </Card>
  )
}