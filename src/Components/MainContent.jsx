/* eslint-disable react-hooks/exhaustive-deps */
import Grid from '@mui/material/Grid2'
import Stack from '@mui/material/Stack'
import Prayers from '../Components/Prayers'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment'
import 'moment/dist/locale/ar-dz'
import axios from 'axios'
import { useEffect, useState } from 'react';


moment.locale("ar")

export default function MainContent() {

    const [nextPrayerIndex ,setNextPrayerIndex] = useState(2)
    const [timings , setTimings] = useState({
        Fajr:'',
        Dhuhr:'',
        Asr:'',
        Maghrib:'',
        Isha:''
    })


    const [selectedCity , setSelectedCity] = useState({
        displayName:"مكه المكرمه",
        apiName:"Makkah al Mukarramah"
    });

    const availableCity = [
        {
            displayName:"مكه المكرمه",
            apiName:"Makkah al Mukarramah"
        },
        {
            displayName:"الرياض",
            apiName:"Riyadh"
        },
        {
            displayName:"الدمام",
            apiName:"Dammam"
        },
        {
            displayName:"القاهره",
            apiName:"Cairo"
        },
        {
            displayName:"المنصوره",
            apiName:"Mansoura"
        },
    ]

    const prayersArray = [
        {key:"Fajr" , displayName:"الفجر"},
        {key:"Dhuhr" , displayName:"الظهر"},
        {key:"Asr" , displayName:"العصر"},
        {key:"Maghrib" , displayName:"المغرب"},
        {key:"Isha" , displayName:"العشاء"},
    ]
    const [remainingTime , setRemainingTime]=useState()
    const [today , setToday] = useState("")
    const getTimings = async ()=>{
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}`);
        setTimings(response.data.data.timings)
    }
    useEffect(() => {
        getTimings();

    }, [selectedCity]);

    useEffect(()=>{
        let interval = setInterval(()=>{
            setupCountDownTimer();
        },1000)

        const t = moment()
        setToday(t.format("MMM Do YYYY | h:mm"))

        return () =>{
            clearInterval(interval)
        }
    },[timings])

    const setupCountDownTimer = () =>{
        const momentNow = moment()

        let prayerIndex = 2;

        if(momentNow.isAfter(moment(timings["Fajr"] , "hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"] , "hh:mm")) ){
            prayerIndex = 1
        }
        else if(momentNow.isAfter(moment(timings["Dhuhr"] , "hh:mm")) && momentNow.isBefore(moment(timings["Asr"] , "hh:mm")) ){
            prayerIndex = 2
        }
        else if(momentNow.isAfter(moment(timings["Asr"] , "hh:mm")) && momentNow.isBefore(moment(timings["Maghrib"] , "hh:mm")) ){
            prayerIndex = 3
        }
        else if(momentNow.isAfter(moment(timings["Maghrib"] , "hh:mm")) && momentNow.isBefore(moment(timings["Isha"] , "hh:mm")) ){
            prayerIndex = 4
        }
        else {
            prayerIndex = 0;
        }
        setNextPrayerIndex(prayerIndex)

        const nextPrayerOpject = prayersArray[prayerIndex];
        const nextParayerTime = timings[nextPrayerOpject.key]
        const reminingTimeMoment = moment(nextParayerTime , "hh:mm")

        let reminingTime = moment(nextParayerTime , "hh:mm").diff(momentNow) 
        if(reminingTime<0){
            const midnightDiff = moment("11:59:59" , "hh:mm:ss").diff(momentNow)
            const fajrToMidnightDiff = reminingTimeMoment.diff(moment("00:00:00","hh:mm:ss"))
            const totalDiff = midnightDiff + fajrToMidnightDiff
            reminingTime = totalDiff
        }
        const durationReminingTime = moment.duration(reminingTime)
        setRemainingTime(`${durationReminingTime.seconds()} : ${durationReminingTime.minutes()} : ${durationReminingTime.hours()}`)



    }
   

    const handleSelectedChange = (event) => {
        const cityOpject = availableCity.find(city =>{
            return city.apiName == event.target.value
        })
        console.log(event.target.value)
        setSelectedCity(cityOpject)
      };
  return (
    <div>
        <Grid container>
            <Grid size={{xs:12 , md:6}}>
                <div>
                    <h2>{today}</h2>
                    <h1>{selectedCity.displayName}</h1>
                </div>
            </Grid>
            <Grid size={{xs:12 , md:6}}>
                <div>
                    <h2>متبقي حتي صلاه {prayersArray[nextPrayerIndex].displayName}</h2>
                    <h1>{remainingTime}</h1>
                </div>
            </Grid>
        </Grid>
        <hr style={{opacity:"0.2"}} />
        <Stack direction={{xs:"column" , md:"row"}} spacing={{xs:4 , md:0}}  justifyContent={"space-around"} style={{margin:"50px"}}>
        {prayersArray.map((prayer) => (
                    <Prayers key={prayer.key} name={prayer.displayName} time={timings[prayer.key]} />
                ))}
        </Stack>

        <Stack direction={'row'} justifyContent={"center"} style={{marginTop:"40px"}}>
            <FormControl  sx={{ m: 2, minWidth: 280 , width: { xs: '60%', md: '25%' } }} size="large" >
                <InputLabel  id="demo-select-small-label">
                    <span style={{color:"white"}}>المدينه</span>
                </InputLabel>
                <Select
                    style={{color:"white"}}
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={selectedCity.apiName}
                    label="Age"
                    onChange={handleSelectedChange}
                >
                    {availableCity.map(city => {
                            return(
                                <MenuItem key={city.apiName} value={city.apiName}>{city.displayName}</MenuItem>
                            );
                    })}
                </Select>
            </FormControl>
        </Stack>
    </div>
  )
}
