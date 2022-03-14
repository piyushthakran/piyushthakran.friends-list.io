const idGenerator = ()=>{
    let id = 0;
    return ()=>{
        id = id+1;
        return id;
    }
}

export default idGenerator();