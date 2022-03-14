import {useEffect, useState} from 'react';
import './App.css';
import FriendCard from './components/friend-card';
import Arrow from './assets/arrow.svg';
import idgenerator from './utils/idgenerator';

const ROWS_PER_PAGE = 4;
const DEBOUNCE_TIME = 400;
const THROTTLE_VAL = 3;
const DEBOUNCE_THROTTLE_STARTS_AFTER = 1000;
/**
 * 
 * below thousand users we don't need debounce and throttling,
 * because it is frontend search, we might not even need it on 1000 users as well
 * so one can change this limit as per their need.
 * 
 */
function App() {
  const [friendList,setFriendList] = useState([]);
  const [filteredFriendList,setfilteredList] = useState([]);
  const [searchVal,setSearchVal] = useState("");
  const [starFilter,setStarFilter] = useState(true);
  const [offset,setOffset] = useState(0);

  const friendAction = (friend,request)=>{
    let cfriendList = [...friendList];
    let index = cfriendList.findIndex((f)=>f.name===friend.name);
    switch(request){
      case 'remove':
        cfriendList.splice(index,1);
        setFriendList(cfriendList);
        setSearchVal("");
        setfilteredList(cfriendList);
        break;
      case 'star':
        let updatedFriend = {...friend};
        updatedFriend.is_starred = !updatedFriend.is_starred;
        cfriendList.splice(index,1,updatedFriend);

        let cfiltereList = [...filteredFriendList];
        let index2 = cfiltereList.findIndex((f)=>f.name===friend.name);
        cfiltereList.splice(index2,1,updatedFriend);

        if(starFilter){
          cfriendList = favouritiesOnTop(cfriendList);
          cfiltereList = favouritiesOnTop(cfiltereList);
        }
        setFriendList(cfriendList);
        setfilteredList(cfiltereList);
        break;
      default:
        //do nothing
    }
  }

  const addFriend = (e)=>{
    //Any text that can be entered can be saved as people sometimes do use
    //special characters (sometime for nick names) and numbers in names
    e.preventDefault();
    if(!filteredFriendList.length){
      let cfriendList = [...friendList];
      cfriendList.push({name:searchVal,is_starred:false,id:idgenerator()});
      setFriendList(cfriendList);
      setSearchVal("");
      setfilteredList(cfriendList);
    }
  }
  
  useEffect(()=>{
    //debounce and throttling effect, depends on searched value
    if(friendList.length<DEBOUNCE_THROTTLE_STARTS_AFTER){
      return ()=>{}
    }
    const timeout = setTimeout(()=>{
      if(!searchVal.length || searchVal.length>=THROTTLE_VAL){
        setfilteredList(filterfriendList(searchVal));
      }
    },DEBOUNCE_TIME)
    return ()=>{
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchVal])

  const search = (val)=>{
    setSearchVal(val);
    if(friendList.length<DEBOUNCE_THROTTLE_STARTS_AFTER){
      setfilteredList(filterfriendList(val));
    }
  }

  const moveStarredOnTop = ()=>{
    let cfriendList = [...friendList];
    let cfiltereList = [...filteredFriendList];
    setFriendList(starFilter?sortById(cfriendList):favouritiesOnTop(cfriendList));
    setfilteredList(starFilter?sortById(cfiltereList):favouritiesOnTop(cfiltereList));
    setStarFilter(!starFilter);
  }

  const next = ()=>{
    let newOffset = ROWS_PER_PAGE+offset;
    if (newOffset<filteredFriendList.length){
      setOffset(newOffset)
    }
  }

  const prev = ()=>{
    let newOffset = offset - ROWS_PER_PAGE;
    if (newOffset>-1){
      setOffset(newOffset)
    }
  }

  const filterfriendList = (val)=>{
    return friendList.filter((friend)=>{
      return friend.name.toLowerCase().includes(val.toLowerCase());
    })
  }

  const favouritiesOnTop = (friendsList)=>{
    let cfriendsList = [...friendsList];
    cfriendsList =  cfriendsList.sort((f1,f2)=>{
      if (!f1.is_starred && f2.is_starred){
        return 1;
      }
      else if(f1.is_starred && !f2.is_starred){
        return -1
      }
      return 0;
    })

    return cfriendsList

  }

  const sortById = (friendsList)=>{
    let cfriendsList = [...friendsList];
    cfriendsList =  cfriendsList.sort((f1,f2)=>{
      if (f1.id > f2.id){
        return 1;
      }
      else if(f1.id < f2.id){
        return -1
      }
      return 0;
    })

    return cfriendsList
  }

  return (
    <div className="App">
      <div className='container'>
        <div className='list-container'>
          <div className='header list-row'>
            <p>Friends List</p>
            <div className='fav-check'>
              <input type="checkbox" checked={starFilter} onChange={moveStarredOnTop} />
              <label>Move favourities to the top?</label>
            </div>
          </div>
          <div className='searchbox list-row'>
            <form onSubmit={addFriend}>
              <input 
                type="text" 
                className='search-input'
                value={searchVal} 
                onChange={(e)=>{search(e.target.value)}} 
                placeholder="Enter your friend's name"
                autoFocus
              />
            </form>
          </div>
          <div>
            {
              (filteredFriendList.slice(offset,offset+ROWS_PER_PAGE)).map((friend,index)=>(
                  <FriendCard 
                    key={friend.name}
                    friend={friend} 
                    index={index} 
                    starCallback={()=>{friendAction(friend,"star")}} 
                    removeCallback={()=>{friendAction(friend,"remove")}}
                  />
              ))
            }
          </div>
          {
            !friendList.length?
            <p className='info'>
              Type in your friend's name and hit enter to save.
            </p>
            :null
          }
          {
            !filteredFriendList.length && friendList.length && searchVal ?
            <p className='info'>
              If you spelled it correctly and you can't find it than hit enter to save your friend's name
            </p>
            :null
          }
          {
            filteredFriendList.length>4 && 
            <div className='pagination-footer'>
              <button onClick={prev} className='prev-arrow'>
                <img src={Arrow} alt="prev" />
              </button>
              <button onClick={next}>
                <img src={Arrow} alt="next" />
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
