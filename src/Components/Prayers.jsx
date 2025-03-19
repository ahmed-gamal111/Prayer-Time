/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Image from '../Image/th.jpeg'

export default function Prayers({name,time}) {
    return (
        <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
        <CardMedia
            component="img"
            height="140"
            image={Image}
            alt="green iguana"
        />
        <CardContent>
            <h2>
                {name}
            </h2>
            <Typography variant="h1" sx={{ color: 'text.secondary' }}>
            {time}
            </Typography>
        </CardContent>
        </CardActionArea>
    </Card>
    )
}
