import {useState} from 'react'
import { Label } from 'semantic-ui-react';
interface LegendInfo{
    name: string
    color: string
}

export function Legend () {
    const [legend, setLegend] = useState<LegendInfo[]>([
        {name: 'Leadership & Readiness', color: '#394f02'},
        {name: 'Personal Finance Management', color: '#060963'},
        {name: 'Personal Growth and Fitness', color: '#8f032f'},
        {name: 'Family Growth & Resiliency', color: '#22663d'},
        {name: 'TS-SCI', color: '#ad5003'},
        {name: 'Spouse Event of Interest', color: '#124f75'},
    ]);

    return(
        <>
        {legend.map(item => (
            <Label size='tiny' key={item.name} 
            style={{backgroundColor: item.color, color: 'white', marginBottom: '5px'}}
            content={item.name}
            />
        ))}
        </>
    )
}