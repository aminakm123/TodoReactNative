import {
  Image, 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import React, {useEffect, useState} from 'react';

export default function App() {
const [inputText, setInputText] = useState("")
console.warn(inputText);
const [todos, setTodos] = useState([

  // {
  //   id: 1,
  //   title: "This is a sample item",
  //   is_completed: false,
  // },
  // {
  //   id: 2,
  //   title: "Attend the marriage",
  //   is_completed: true,
  // },
  // {
  //   id: 3,
  //   title: "Football Match",
  //   is_completed: false,
  // },
]);

const fetchTasks = () => {
  axios
    .get('https://todo.talrop.works/')
    .then(response => setTodos(response.data))
    .catch(error => console.error(error));
}

useEffect(() => {
  fetchTasks()
  // axios.get('https://todo.talrop.works/')
  // .then(response => setTodos(response.data))
  // .catch(error => console.error(error));
}, [])

const addToList = () => {
  axios.post('https://todo.talrop.works/create/', {
   title: inputText,
  })
  .then(response => {console.log(response.data);setInputText("");fetchTasks();})
  .catch(error => console.log(error));
  // if(inputText) {
  //   setTodos([
  //     ...todos,
  //     {id: Math.random()*1000, title: inputText, is_completed: false},
  //   ]);  
  //   setInputText("")
  // }
};

const removeItem = todo => {
  axios
    .post('https://todo.talrop.works/delete/$(todo.id)/',{
      is_deleted: !todo.is_deleted,
    })
    .then(response => {console.log(response.data);
    fetchTasks();
    })
    .catch(error => console.log(error))
    // setTodos(todos.filter(el =>el.i !== todo.id));
};

const handleStatus = todo => {
  axios.post('https://todo.talrop.works/update/$(todo.id)/',{
    is_completed: !todo.is_completed,
  })
  .then(response => {console.log(response.data);
  fetchTasks();
  })
  .catch(error => console.log(error))
  // setTodos(
  //   todos.map((item) => {
  //     if(item.id === todo.id){
  //       return{
  //         ...item,
  //         is_completed: !item.is_completed,
  //       };
  //     }
  //     return item;
  //   }),
  // );
};

// const markAsDone = (todo) => {
//   setTodos(
//     todos.map((item) => {
//       if(item.id === todo.id){
//         return{
//           ...item,
//           is_completed: true,
//         };
//       }
//       return item;
//     }),
//   );
// };

// const markAsUndo = (todo) => {
//   setTodos(
//     todos.map((item) => {
//       if(item.id === todo.id){
//         return{
//           ...item,
//           is_completed: false,
//         };
//       }
//       return item;
//     }),
//   );
// };

  const TodoItem = ({todo}) => (
    <View style={styles.itemView}>
      {
        todo.is_completed ? (
          <View style={styles.itemLeft}>
            <Image 
          style={styles.checkIcon}
          source={require('./src/assets/icons/check.png')} 
          />          
          <Text style={styles.itemTitle}>{todo.title}</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.itemLeft}
            onPress={()=> handleStatus(todo)}>
          <View style={styles.circleView}></View>
          <Text style={styles.itemTitle}>{todo.title}</Text>
          </TouchableOpacity>
        )
      }
      {/* // <TouchableOpacity style={styles.itemLeft}>
      //   <View style={styles.circleView}></View>
      //   <Text style={styles.itemTitle}>{todo.title}</Text>
      // </TouchableOpacity> */}
      <View style={styles.rightBox}>
        {todo.is_completed && (
          <TouchableOpacity onPress={() => handleStatus(todo)}>
            <Image style={styles.undoIcon} source={require('./src/assets/icons/undo.png')} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() =>removeItem(todo)}>
          <Image 
            style={styles.deleteIcon}
            source={require('./src/assets/icons/delete.png')} 
          />
        </TouchableOpacity>
      </View>
    </View>
  )
  return(
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.containerView}>
        <Text style={styles.mainTitle}>Todo App</Text>
        <View style={styles.sectionView}>
          <Text style={styles.sectionTitle}>Todo List</Text>
          {todos
          .filter((item)=> !item.is_completed)
          .map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
          {/* <TodoItem />           */}
          
          {/* <View style={styles.itemView}>
            <TouchableOpacity style={styles.itemLeft}>
              <View style={styles.circleView}></View>
              <Text style={styles.itemTitle}>
                This is a sample todo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image 
                style={styles.deleteIcon}
                source={require('./src/assets/icons/delete.png')} 
              />
            </TouchableOpacity>
          </View> */}
          <View style={styles.addView}>
            <View style={styles.addLeft}>
              <Text style={styles.typeText}>+</Text>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                style={[styles.typeText, {marginLeft: 13}]} 
                placeholder="Type new todo..." 
              />
            </View>
            <TouchableOpacity 
              onPress={addToList}
              style={styles.addButton}>
              <Text style={styles.addText}>Add New</Text>
            </TouchableOpacity>
          </View>
        </View>    
        <View style={styles.sectionView}>
          <Text style={styles.sectionTitle}>Completed Todo's</Text>
          {todos
          .filter((item)=> item.is_completed)
          .map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
          {/* <TodoItem /> */}
        </View>    
      </ScrollView>
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  containerView: {
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionView: {
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 19,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 13,},
  circleView: {
    height: 22,
    width: 22,
    borderRadius: 22/2,
    borderColor: "#2d2d2d",
    borderWidth: 2,
  },
  deleteIcon: {
    height: 25,
    width: 25,
  },
  undoIcon: {
    height: 25,
    width: 25,
    marginRight: 14,
  },
  checkIcon: {
    height : 25,
    width : 25,
  },
  addView: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addLeft: {
    height: 45,
    flex: 1,
    paddingHorizontal: 15,
    borderColor: '#999',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: "center",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,    
  },
  typeText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'grey',
  },
  addButton: {
    backgroundColor: '#2196f3',
    height: '100%',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  addText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  rightBox:{
    flexDirection: 'row',
    alignItems: 'center',
  }
});