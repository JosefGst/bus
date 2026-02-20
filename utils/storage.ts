import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_STOP_KEY = 'FAVORITE_STOP_IDS';

// Mutex to serialize AsyncStorage operations and prevent race conditions
let operationQueue: Promise<void> = Promise.resolve();

/**
 * Append a stop ID to favorites with race condition protection.
 * Returns true if successful, false otherwise.
 */
export async function appendFavoriteStopId(stopId: string): Promise<boolean> {
  // #region agent log
  fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:12',message:'appendFavoriteStopId entry',data:{stopId},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  // Wait for previous operation to complete, then execute this one
  await operationQueue;
  
  // Create a new promise that will be awaited by the next operation
  let resolveNext: () => void;
  const nextOperation = new Promise<void>((resolve) => {
    resolveNext = resolve;
  });
  
  // Update the queue BEFORE starting the operation (critical for race condition prevention)
  operationQueue = nextOperation;
  
  try {
    // #region agent log
    fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:25',message:'Reading AsyncStorage (serialized)',data:{stopId},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const existing = await AsyncStorage.getItem(FAVORITE_STOP_KEY);
    let ids: string[] = [];
    if (existing) {
      try {
        ids = JSON.parse(existing);
        if (!Array.isArray(ids)) {
          ids = [];
        }
      } catch (parseError) {
        // #region agent log
        fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:35',message:'JSON parse error, resetting',data:{stopId,error:String(parseError)},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        ids = [];
      }
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:42',message:'Before duplicate check',data:{stopId,existingIds:ids,alreadyExists:ids.includes(stopId)},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'A,D'})}).catch(()=>{});
    // #endregion
    
    let success = false;
    if (!ids.includes(stopId)) {
      ids.push(stopId);
      // #region agent log
      fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:48',message:'Writing to AsyncStorage',data:{stopId,idsToSave:ids},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'A,B,C,E'})}).catch(()=>{});
      // #endregion
      await AsyncStorage.setItem(FAVORITE_STOP_KEY, JSON.stringify(ids));
      
      // Verify the write succeeded by reading back
      const verify = await AsyncStorage.getItem(FAVORITE_STOP_KEY);
      const verifyIds = verify ? JSON.parse(verify) : [];
      success = Array.isArray(verifyIds) && verifyIds.includes(stopId);
      
      // #region agent log
      fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:56',message:'AsyncStorage write verified',data:{stopId,success,verifyIds},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'A,B,C,E'})}).catch(()=>{});
      // #endregion
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:61',message:'StopId already exists',data:{stopId},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      success = true; // Already exists, consider it success
    }
    
    // Signal next operation can proceed
    resolveNext!();
    
    // #region agent log
    fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:67',message:'appendFavoriteStopId exit',data:{stopId,success},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'A,B,C'})}).catch(()=>{});
    // #endregion
    return success;
  } catch (e) {
    // Signal next operation can proceed even on error
    resolveNext!();
    
    // #region agent log
    fetch('http://127.0.0.1:7762/ingest/956c9b76-c79f-4ae9-ad09-1053517c875a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1e9dd1'},body:JSON.stringify({sessionId:'1e9dd1',location:'storage.ts:75',message:'appendFavoriteStopId error caught',data:{stopId,error:String(e),errorType:typeof e},timestamp:Date.now(),runId:'post-fix-v2',hypothesisId:'B,E'})}).catch(()=>{});
    // #endregion
    console.error('Failed to append favorite stop id', e);
    return false;
  }
}

export async function loadFavoriteStopIds(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_STOP_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('Failed to load favorite stop ids', e);
    return [];
  }
}
