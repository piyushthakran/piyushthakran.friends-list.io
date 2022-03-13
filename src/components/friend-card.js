import React from 'react';
import '../styles/friend-card.css';
import StarIcon from './../assets/star.svg';
import StarFilledIcon from './../assets/star-filled.svg';
import TrashIcon from './../assets/trash.svg';

const FriendCard = ({friend,starCallback,removeCallback,index})=>{
    return(
        <div className='friend-card'>
            <div>
                <p className='friend-name'>{friend.name}</p>
                <p className='subtext'>is your friend</p>
            </div>
            <div className='action-section'>
                <button className='star-btn btn' onClick={()=>starCallback(friend,index)}>
                    {friend.is_starred?
                        <img src={StarFilledIcon} alt="starred" />
                        :<img src={StarIcon} alt="star" />
                    }
                </button>
                <button className='delete-btn btn' onClick={()=>removeCallback(index)}>
                    <img src={TrashIcon} alt="remove" />
                </button>
            </div>
        </div>
    )
}

export default FriendCard;