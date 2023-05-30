import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';


import ProbMain from "./component/ProbMain";
import AudRef from "./component/AudRef";
import ProbChoice from "./component/ProbChoice";
import ProbSub from "./component/ProbSub";
import ProbTxt from "./component/ProbTxt"
import ProbScrpt from './component/ProbScrpt';
import Result from './component/Result';

const LoadProblemScreen = (loadedProblem, setProblemStructure, choiceRef, setNextBtn) => {
    // MOUNT시 실행되는 함수
    // 모든 문제에 대해서 구조화
  
    let question = []
    let problemStructures = [];

    
    for(var i=0; i<loadedProblem.length; i++){
        question = []

        // component화 하기

        // PRB_MAIN_CONT: 메인 문제
        question.push(<ProbMain PRB_MAIN_CONT = {loadedProblem[i].PRB_MAIN_CONT} PRB_NUM = {loadedProblem[i].PRB_NUM} key = {i*6+0}/>)
        if(loadedProblem[i].PRB_SECT == "듣기"){
            question.push(<AudRef AUD_REF = {loadedProblem[i].AUD_REF} key = {i*6+1}/>)

            // PRB_SUB_CONT: 서브 문제
            if(loadedProblem[i].PRB_SUB_CONT){
                question.push(<ProbSub PRB_SUB_CONT = {loadedProblem[i].PRB_SUB_CONT} key = {i*6+2}/>)
            }

        }else if(loadedProblem[i].PRB_SECT == "읽기"){
            // PRB_TXT: 지문
            question.push(<ProbTxt PRB_TXT = {loadedProblem[i].PRB_TXT} key = {i*6+1}/>)

             // PRB_SUB_CONT: 서브 문제
            if(loadedProblem[i].PRB_SUB_CONT){
                question.push(<ProbSub PRB_SUB_CONT = {loadedProblem[i].PRB_SUB_CONT} key = {i*6+2}/>)
            }// PRB_SCRPT: 서브 지문
            if(loadedProblem[i].PRB_SCRPT){
                question.push(<ProbScrpt PRB_SCRPT = {loadedProblem[i].PRB_SCRPT} key = {i*6+3} />)
            }
        }

        // PRB_CHOICE1 ~ 4: 4지 선다
        question.push(<ProbChoice
            PRB_CHOICE1= {loadedProblem[i].PRB_CHOICE1} 
            PRB_CHOICE2={loadedProblem[i].PRB_CHOICE2} 
            PRB_CHOICE3= {loadedProblem[i].PRB_CHOICE3} 
            PRB_CHOICE4={loadedProblem[i].PRB_CHOICE4} 
            PRB_CORRT_ANSW = {loadedProblem[i].PRB_CORRT_ANSW}

            choiceRef = {choiceRef}
            nextBtn = {i}
            setNextBtn = {setNextBtn}

            key = {i*6+4}
        />)

        problemStructures.push(<ScrollView style = {styles.container} key = {i*6+5}>{question}</ScrollView>)
    }


    setProblemStructure(problemStructures)
}



const RecommendStudyScreen = ({route, navigation}) =>{
    // 문제구조 html 코드
    const [problemStructure, setProblemStructure] = useState([]); // component
    // 백엔드에서 불러온 json 문제
    const [loadedProblem, setLoadedProblem] = useState([]); // json
    // 다음 문제를 넘길 때 사용
    const [nextBtn, setNextBtn] = useState(0);

    // 맞춘 답 개수 
    const [correct, setCorrect] = useState(-1);

    // 4지선다 컴포넌트에서 사용자가 고른 답을 저장
    const choiceRef = useRef(0);
    // 유저 답안 기록
    const answerRef = useRef([]);


    // 콜렉션 불러오기
    const problemCollection = firestore().collection('problems').doc("EQ60LV2RDG46");
    

    // MOUNT 
    useEffect(()=> {
        // promise 객체를 반환하는 함수
        async function dataLoading(){
            try{
                const data = await problemCollection.get(); // 요청한 데이터가 반환되면 다음 줄 실행

                // setLoadedProblem(data.docs.map(doc => ({...doc.data()})))
                setLoadedProblem([data._data])
            }catch(error){
                console.log(error.message);
            }    
        }

        dataLoading();

        return () => {
            console.log("문제 풀이 완료")
        }
    }, []);
    // setState 실행


    
    // 모든 문제를 불러온 후 구조 만들기
    useEffect(()=>{
        LoadProblemScreen(loadedProblem, setProblemStructure, choiceRef, setNextBtn);
    }, [loadedProblem])
   
    
    // 문제 풀이 결과를 보냄 or 저장
    useEffect(()=>{
        // console.log(`
        //     {   
        //         userId: hello,
        //         PRB_ID: AAAAAAAAAAAA,
        //         elapsed_time(sec): 10,
        //         Success: True,
        //         Date: 2023-04-17,
        //         Rank(1-5 level): 4 
        //     }
        // `);

        if(nextBtn>0){
            console.log(choiceRef.current)
            answerRef.current.push({USER_CORRT_ANSW: choiceRef.current})
        }
        
        if(nextBtn > 0 && nextBtn == loadedProblem.length){
            let correct_cnt = 0
            loadedProblem.forEach((data, index) => {
                if(data.PRB_CORRT_ANSW == answerRef.current[index].USER_CORRT_ANSW)
                    correct_cnt++
            })

            setCorrect(correct_cnt)
            return 
        }

        choiceRef.current = 0;
    }, [nextBtn])
    

    return (
        <View style = {{flex: 1}}>
            {
                correct == -1 ? (
                problemStructure[nextBtn]) :(
                <Result CORRT_CNT = {correct} ALL_CNT = {answerRef.current.length} navigation = {navigation} PATH = "Recommend"/>)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 20,
    },
})

export default RecommendStudyScreen;