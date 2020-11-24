import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal} from 'react-native';
import axios from 'axios';
import {Feather, FontAwesome5, FontAwesome} from '@expo/vector-icons';
import Constants from 'expo-constants'; 
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

export default function App() {

  const[tempNow, setTempNow] = useState('0');
  const[tempMinDay, setTempMinDay] = useState('0');
  const[tempMaxDay, setTempMaxDay] = useState('0');
  const[city, setCity] = useState('');
  const[cityOfficial, setCityOfficial]=useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const[cityEscolhida, setCityEscolhida]=useState('0');
  const[conditionNow, setConditionNow]=useState([]);
  const[humidity, setHumidity]=useState('');
  const[wind, setWind]=useState('');
  const[pressure, setPressure]=useState('');
  const[feelsLike, setFeelsLike]=useState('0');
  const[lat, setLat]=useState('0');
  const[long, setLong]=useState('0');
  const[proxDaysTemp, setProxDaysTemp]=useState([]);
 

  

  async function getTempNow(){
    try{

      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid={yourapi}&lang=pt_br`);

      

      const temperatura = response.data.main.temp - 273;

      

      const feels_like = response.data.main.feels_like - 273;

      setLat(response.data.coord.lat);
      setLong(response.data.coord.lon);

      setFeelsLike(feels_like.toFixed());

      const condition = response.data.weather.map(setConditionNow);

      setCityOfficial(response.data.name);

      setTempNow(temperatura.toFixed());

      
      
      setHumidity(response.data.main.humidity);

      setWind(response.data.wind.speed);

      setPressure(response.data.main.pressure);

      const more1 = '1';

      setCityEscolhida(more1);

      setModalVisible(!modalVisible);

      const responsetwo = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,current,
    minutely,alerts&appid={yourapi}&lang=pt_br&units=metric`)

    const today = await responsetwo.data.daily.map((item, index)=>{
      if(index === 0){
        const tempMin = item.temp.min ;

        const tempMax = item.temp.max;

        if(tempNow > tempMax){
          setTempMaxDay(tempNow);
        }else{
          setTempMaxDay(tempMax.toFixed());
        }

        if(tempNow < tempMin){
          setTempMinDay(tempNow);
        }else{
          setTempMinDay(tempMin.toFixed());
        }
      }
    })
    
     const nextDaysTemp = await responsetwo.data.daily.filter((item,index)=>{
      return index >=1 && index <=4;
    })

    setProxDaysTemp(nextDaysTemp);
    console.log(proxDaysTemp);
    
       
    }
    catch(err){

      const less1 = '2';

      setCityEscolhida(less1);

      setModalVisible(!modalVisible);

      console.log(err)
    }
  
  }

  const optionsDate = {
     month: 'numeric', day: 'numeric',
    hour12: false,
     
  };
 


  return (
    <>
    <View style={styles.container}>

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        
        >
        <View style={styles.modalContainer}>    
            <View style={styles.modalView}>
            <View style={styles.modalContent}>
            <TextInput 
              style={styles.inputCity} 
              placeholder="Digite a cidade"
              placeholderTextColor="#333"
              value={city}
              onChangeText={setCity}
            />
            <TouchableOpacity style={[styles.buttonSearch,{ width:'100%'}]} onPress={getTempNow}>
              <Feather name="search" size={24} color="#fff"/>
              <Text style={{color:'white', fontWeight:'bold', fontSize:20}}>Pesquisar</Text>
            </TouchableOpacity>
            </View>
            </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.buttonSearch} onPress={() => {setModalVisible(true)}}>
      {cityEscolhida == 0 || cityEscolhida == 2 ? 
        <>
        <Text style={styles.textSearch}>Adicionar Cidade</Text> 
        <Feather name="plus" size={24} color="#fff"/>
        </>
        :
        <>
        <Text style={styles.textSearch}> Alterar Cidade </Text>
        <Feather name="edit-2" size={20} color="#fff"/>
        </>
        }
      
      
        
     
     
       </TouchableOpacity>
      <View style={[styles.tempInfo,tempNow >= 25 && tempNow <= 29 ? styles.tempInfoColor : tempNow == 30 ? styles.tempInfoColor2 : styles.tempInfoColor3]}>
        {
          cityEscolhida == 0 ?
        <View style={styles.cityNaoEscolhida}>
        <Text style={styles.textCityEscolhida}>Adicione uma cidade acima para ver a temperatura atual e dos próximos dias.</Text>
        </View>
        :
        cityEscolhida == 2 ?

        <View style={styles.cityNaoEscolhida}>
        <Text style={styles.textCityEscolhida}>Ops, Algo deu errado!</Text>
        </View>

        :
        
        <>
        

        <View style={styles.cityView}> 
          <Text style={styles.cityInfo}>{cityOfficial} </Text>
          
        </View>

        <View style={{ alignItems:'center', justifyContent:'center', marginTop:10}}>
        {
          conditionNow.description == 'céu limpo' ?
        <>
        <FontAwesome name="sun-o" size={75} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Céu limpo</Text>
        </>
        : conditionNow.description == 'algumas nuvens' ?
        <>
        <FontAwesome5 name="cloud-sun" size={75} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Algumas nuvens</Text>
        </>
        : conditionNow.description == 'nublado' ?
        <>
        <FontAwesome5 name="cloud" size={75} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Nublado</Text>
        </>
        :
        conditionNow.description == 'fumaça' ?
        <>
        <FontAwesome5 name="cloud" size={75} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Fumaça</Text>
        </>
        :
        conditionNow.description == 'chuvas' ?
        <>
        <FontAwesome5 name="cloud-showers-heavy" size={75} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Chuva</Text>
        </>
        :
        conditionNow.description == 'chuva moderada' ?
        <>
        <FontAwesome5 name="cloud-rain" size={75} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Chuva moderada</Text>
        </>
        :

        conditionNow.description == 'chuva leve' ?
        <>
        <FontAwesome5 name="cloud-rain" size={75} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Chuva leve</Text>
        </>
        :
        conditionNow.description == 'nuvens dispersas' ?
        <>
        <FontAwesome5 name="cloud" size={75} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Nuvens dispersas</Text>
        </>
        :
        <>
        <Feather name="cloud-off" size={65} color="#fff"/>
        <Text style={{color:"#fff", fontWeight:'bold'}}>Sem informações</Text>
        </>
        }

        </View>

        <View style={styles.tempView}> 
          
          <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'center',marginBottom:15}}>
          <Text style={styles.tempCityInfo}>{tempNow}° </Text>
          <View style={styles.mediaArea}>
            <Text style={{color: 'orange'}}>{tempMaxDay}°</Text>
            <Text style={{color: '#7bb2d9'}}>{tempMinDay}°</Text> 
          </View>

         
          </View>

          <Text style={{marginBottom:15, color:'#fff'}}>Sensação térmica: {feelsLike}°</Text>

          <View style={styles.moreInfosView}>
          <View style={styles.moreInfosCard}>
            <Feather name="thermometer" size={25} color="#fff"/>
            <Text style={{color:'#fff', fontWeight:'bold'}}>{humidity}%</Text>
          </View>
          <View style={styles.moreInfosCard}>
            <Feather name="wind" size={25} color="#fff"/>
            <Text style={{color:'#fff', fontWeight:'bold'}}>{wind}m/s</Text>
          </View>
          <View style={styles.moreInfosCard}>
            <Feather name="arrow-down" size={25} color="#fff"/>
            <Text style={{color:'#fff', fontWeight:'bold'}}>{pressure}mBar</Text>
          </View>
        </View>

        
        
        </View>

        
        

        

        <View style={styles.nextDaysContainer}>
        <View style={styles.nextDaysTextContainer}>
        <Text style={styles.nextDaysText}>Informações dos próximos dias</Text>
        </View>
        <View style={styles.nextDaysInfo}>
        {
          proxDaysTemp.map(item=>(
            <> 

             <View>
               <Text key={item.sunrise} style={{color:"#fff", alignSelf:'center'}}>{Intl.DateTimeFormat('pt-BR', optionsDate).format(new Date(item.dt*1000))}</Text>      
            <View key={item.dt} style={styles.uniqueDay}>
              
              <View>
              <Text style={styles.tempMaxNextDays}>{item.temp.max.toFixed()}°</Text>
              <Text style={styles.tempMinNextDays}>{item.temp.min.toFixed()}°</Text>
              </View>
              
              <View style={styles.borderLeft}>
            {item.weather.map(item=>(
                item.description == 'céu limpo' ?
                <>
                <FontAwesome name="sun-o" size={20} color="#fff"/>
                
                </>
                : item.description == 'algumas nuvens' ?
                <>
                <FontAwesome5 name="cloud-sun" size={20} color="#fff"/>
                
                </>
                : item.description == 'nublado' ?
                <>
                <FontAwesome5 name="cloud" size={20} color="#fff"/>
               
                </>
                :
                item.description == 'fumaça' ?
                <>
                <FontAwesome5 name="cloud" size={20} color="#fff"/>
                
                </>
                :
                item.description == 'chuvas' ?
                <>
                <FontAwesome5 name="cloud-showers-heavy" size={20} color="#fff"/>
                
                </>
                :
                item.description == 'chuva moderada' ?
                <>
                <FontAwesome5 name="cloud-rain" size={20} color="#fff"/>
                
                </>
                :

                item.description == 'chuva leve' ?
                <>
                <FontAwesome5 name="cloud-rain" size={20} color="#fff"/>
                </>
                :
                item.description == 'nuvens dispersas' ?
                <>
                <FontAwesome5 name="cloud" size={20} color="#fff"/>
                </>
                :
                <>
                <Feather name="cloud-off" size={18} color="#fff"/>
                
                </>
              
            ))}
            
            </View>
             
            </View>
            </View>
            

            </>

            ))
        }
        
        </View>
        </View>

        
        </>
        } 
      </View>

      
      <StatusBar style="light" />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003554',
    paddingTop:Constants.statusBarHeight + 10,
    alignItems:'center'
   
  },
  
  inputCity:{
    borderWidth:1,
    height:50,
    width:'100%',
    paddingHorizontal: 5,
    borderRadius:3,
    borderColor:'orange',
    borderWidth:2,
    backgroundColor:'white'
  },
  buttonSearch:{
    borderRadius:3,
    marginBottom:30,
    width:'90%',
    height:50,
    backgroundColor:'orange',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'
  },
  textSearch:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:20
  },
  tempInfo:{
    height:'80%',
    width:'90%',
    borderRadius:5,
  },
  tempInfoColor:{
    backgroundColor:'#5F00BA',
  },
  tempInfoColor2:{
    backgroundColor:'#333',
  },
  tempInfoColor3:{
    backgroundColor:'#006494',
  },
  tempNextDays:{
    width:'85%',
    height:'20%',
    backgroundColor:'#006494',
    marginTop:10,
    borderRadius:5
  },
  cityNaoEscolhida:{
    backgroundColor:'#006494',
    height:420,
    flexDirection:'row',
    alignItems:'center',
    
  },
  textCityEscolhida:{
    fontSize:20,
    fontWeight:'bold',
    color:'#fff',
    marginHorizontal:10
  },

  cityView:{
    height:'18%',
    justifyContent:'center',
    paddingHorizontal:25
  },
  cityInfo:{
    fontSize:28,
    fontWeight:'bold',
    color:'#fff',
    
  },
  tempView:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    height:'50%',
    
  },
  tempCityInfo:{
    fontSize:55,
    color:'#fff'
  },
  tempMaxNextDays:{
    color:'white',
    fontSize:15, 
    paddingRight:7
  },
  tempMinNextDays:{
    color:'white',
    fontSize:15, 
    paddingRight:7
  },
  nextDaysText:{
    color:'white',
    fontSize:14
  },
  nextDaysTextContainer:{
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:5
  },
  nextDaysContainer:{
    
    height:'20%',
    borderBottomRightRadius:5,
    borderBottomStartRadius:5,    
    width:'100%',
    backgroundColor:'#7bb2d9'
  },
  nextDaysInfo:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    height:'70%',
    
  },
  viewNextDays:{
    
    width:'25%',
    justifyContent:'center',
    alignItems:'center',
    height:'50%'
  },
  textDay:{
    color:'#fff',
    fontSize:16
  },
  modalContainer:{
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.4)'
  },
  modalView:{
      height:'32%',
      backgroundColor:'white',
      borderRadius:2,
      width:'90%',
      
  },
  modalContent:{
      height:'100%',
      justifyContent:'space-around',
      paddingHorizontal:35,
      
  },
  mediaArea:{
    width:50,
    height:55,
    borderLeftWidth:1,
    borderLeftColor:'#fff',
    paddingLeft:14,
    justifyContent:'center',
  },
  borderLeft:{
    borderLeftWidth:1,
    borderLeftColor:'#fff',
    paddingLeft:5
    
  },
  moreInfosView:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    height:100,
    width:'100%',
   
  },
  moreInfosCard:{
    height:80,
    width:80,
    backgroundColor:'#8bb2d9',
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center'
  },
  uniqueDay:{
    flexDirection:'row',
    alignItems:'center',
  }
});
