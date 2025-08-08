import { useState, useEffect } from 'react';

function App() {

    const [outlet, setOutlet] = useState("");
    const [errorLog, setErrorLog] = useState("dasdsa");
    const [updateList, setUpdateList] = useState([]);

  const handleSubmitOutlet = (e) => {
     e.preventDefault(); 
    window.electronAPI.sendOutletCode(outlet);
  };

  const clickReload = () =>{
    alert('Klik reload available updates')
  }
  
  const clickUpdate = (version) =>{
    alert('Gas Update '+version)
  }



  const updateAvailable = [
    '250101',
    '250102',
    '250103',
    '250104',
    '250105'
  ]

  const updateCompleted = [
    '250101',
    '250102'
  ]

useEffect(() => {
  window.electronAPI?.onLogUpdate?.((logText) => {
    setErrorLog(prev => `${logText}\n${prev}`);
  });
}, []);

useEffect(() => {
  window.electronAPI?.addSongItemList?.((data) => {
    console.log('MASUK UPDATE', data);
    setUpdateList(data);
  });
}, []);

useEffect(() => {
  window.electronAPI?.updateDownloadProgress?.((data) => {
    setUpdateList((prevList) =>
    prevList.map((item) =>
      item.fileName === data.fileName? { ...item, ...data }
      : item
    ));
  });
}, []);

useEffect(() => {
  window.electronAPI?.updateMovingQueueState?.((data) => {
    setUpdateList((prevList) =>
    prevList.map((item) =>
      item.fileName === data.fileName? { ...item, ...data }
      : item
    ));
  });
}, []);

  return (
    <>
      <div className='w-screen h-screen'>
        <div className='flex flex-col items-center'>
          <p className='font-poppins text-2xl'>Program Update Lagu VOD1</p>
        </div>
        <div className='w-full flex'>
          <div className='w-1/2 flex flex-col items-center p-3'>
            <div className='w-full flex flex-col items-center p-2 bg-white border border-gray-200 rounded-lg shadow'>
              <p className='font-poppins text-lg font-medium'>Download Progress</p>
              <div className='h-2'/>
              <div className='w-full h-64 overflow-auto border p-4'>
                {updateList.map((lagu, index) => {
                  if (lagu.state === 'WAITING') {
                    return <div key={index} className='w-full flex flex-col items-start shadow p-1'>
                      <div className='w-full flex items-between'>
                        <div className='flex items-center'>
                          <p className='text-sm'>{lagu.location}</p>
                          <p className='text-sm'>/</p>
                          <p className='text-sm'>{lagu.fileName}</p>
                        </div>
                        <div className='w-full flex justify-end items-center'>
                          <p className='text-orange-800 font-semibold text-sm'>Menunggu</p>
                        </div>
                      </div>
                      <div>
                      </div>
                      </div>;
                  } else if (lagu.state === 'DOWNLOADING') {
                    return <div key={index} className='w-full flex flex-col items-start shadow p-1'>
                      <div className='w-full flex items-between'>
                        <div className='flex items-center'>
                          <p className='text-sm'>{lagu.location}</p>
                          <p className='text-sm'>/</p>
                          <p className='text-sm'>{lagu.fileName}</p>
                        </div>
                        <div className='w-full flex justify-end'>
                          <p className='text-blue-800 font-semibold items-center text-sm'>downloading</p>
                        </div>
                      </div>
                      <div className='w-full'>
                        <div className="w-full flex flex-col">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div className="bg-blue-600 h-4 rounded-full text-sm"style={{ width: `${lagu.downloadPercent}%`}}/>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-blue-700">{lagu.downloadPercent}%</span>
                              <span className="text-sm font-medium text-black">{lagu.downloadSpeed}</span>
                            </div>
                          </div>
                      </div>
                    </div>;
                  }
                  else if (lagu.state === 'WAITING_MOVE') {
                    return <div key={index} className='w-full flex flex-col items-start shadow p-1'>
                      <div className='w-full flex items-between'>
                        <div className='flex items-center'>
                          <p className='text-sm'>{lagu.location}</p>
                          <p className='text-sm'>/</p>
                          <p className='text-sm'>{lagu.fileName}</p>
                        </div>
                        <div className='w-full flex justify-end items-center'>
                          <p className='text-green-800 font-semibold text-sm'>Menunggu Dipindah</p>
                        </div>
                      </div>
                      <div>
                      </div>
                    </div>;
                  }
                  else if (lagu.state === 'MOVING') {
                    return <div key={index} className='w-full flex flex-col items-start shadow p-1'>
                      <div className='w-full flex items-between'>
                        <div className='flex items-center'>
                          <p className='text-sm'>{lagu.location}</p>
                          <p className='text-sm'>/</p>
                          <p className='text-sm'>{lagu.fileName}</p>
                        </div>
                        <div className='w-full flex justify-end'>
                          <p className='text-yellow-800 font-semibold items-center text-sm'>Memindah</p>
                        </div>
                      </div>
                      <div className='w-full'>
                        <div className="w-full flex flex-col">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div className="text-sm bg-yellow-600 h-4 rounded-full"style={{ width: `${lagu.movePercent}%`}}/>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-yellow-700">{lagu.movePercent}%</span>
                            </div>
                          </div>
                      </div>
                    </div>;
                  }
                  else if (lagu.state === 'DONE') {
                    return <div key={index} className='w-full flex flex-col items-start shadow p-1'>
                      <div className='w-full flex items-between'>
                        <div className='flex items-center'>
                          <p className='text-sm'>{lagu.location}</p>
                          <p className='text-sm'>/</p>
                          <p className='text-sm'>{lagu.fileName}</p>
                        </div>
                        <div className='w-full flex justify-end'>
                          <p className='text-green-800 font-semibold items-center text-sm'>Selesai</p>
                        </div>
                      </div>
                      <div>
                      </div>
                    </div>;
                  } else if (lagu.state === 'FAILED') {
                    return <div key={index} className='w-full flex flex-col items-start shadow p-1'>
                      <div className='w-full flex items-between'>
                        <div className='flex items-center'>
                          <p className='text-sm'>{lagu.location}</p>
                          <p className='text-sm'>/</p>
                          <p className='text-sm'>{lagu.fileName}</p>
                        </div>
                        <div className='w-full flex justify-end'>
                          <p className=''>{lagu.state}</p>
                        </div>
                      </div>
                      <div>
                      </div>
                    </div>;
                  } else {
                    return null; // untuk state yang tidak dikenali
                  }
                })}
              </div>
            </div>
            <div className='w-full flex flex-col items-center'>
              <p className='font-poppins text-md font-medium'>Error log</p>
              <textarea
                className="w-full h-48 p-2 border rounded-md bg-white text-black font-mono text-sm resize-none overflow-y-auto"
                readOnly
                value={errorLog}
              />
            </div>
          </div>
          <div className='w-1/2 flex flex-col items-center p-3'>
            <div className='w-full flex flex-col items-center p-2 bg-white border border-gray-200 rounded-lg shadow'>
              <p className='font-poppins text-md font-medium'>Utilities</p>
              <div className='w-full flex flex-col items-start'>
                <div className='flex'>
                  <form onSubmit={handleSubmitOutlet} className="flex items-center">
                    <span className="text-gray-700 text-sm">Outlet:</span>
                    <div className='w-3'/>
                    <input
                      type="text"
                      value={outlet}
                      onChange={(e) => setOutlet(e.target.value)}
                      className="block w-full border text-xs p-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className='w-3'/>
                    <button
                      type="submit"
                      className="p-0.5 text-sm bg-teal-600 text-white rounded hover:bg-teal-700">
                      Submit
                    </button>
                  </form>
                </div>
                <div className='flex'> 
                  <p className='text-sm'>Main Server:</p>
                  <div className='w-2'/>
                  <p className='text-sm text-green-700'>OK</p>
                </div>
                <div className='flex'> 
                  <p className='text-sm'>Secondary Server:</p>
                  <div className='w-2'/>
                  <p className='text-sm text-green-700'>OK</p>
                </div>
              </div>
            </div>
            <div className='h-2'/>
            <div className='w-full flex flex-col items-center h-56 p-2 bg-white border border-gray-200 rounded-lg shadow'>
              <div className='w-full flex justify-between'>
                <div/>
                <p className='font-poppins text-md font-medium'>Update Available</p>
                <button
                  onClick={clickReload}
                  className='p-0.5 text-xs bg-teal-600 text-white rounded-md hover:bg-teal-70'
                >
                  Reload
                </button>
              </div>
              <div className='w-full flex flex-col items-start mt-4'>
                {
                  updateAvailable.map((version)=>{
                      return (
                        <div key={version} className='w-full flex justify-between items-center mb-1'>
                          <p className='text-md'>
                            {version}
                          </p>
                          <button
                            onClick={() => clickUpdate(version)}
                            className='p-0.5 text-xs bg-teal-600 text-white rounded-md hover:bg-teal-70'
                          >
                            <p className='text-xs px-2 py-0.5'>Update</p>
                          </button>
                        </div>
                      )
                  })
                }
              </div>
            </div>
            <div className='h-2'/>
            <div className='w-full flex flex-col max-h-44 items-center p-2 bg-white border border-gray-200 rounded-lg shadow'>
              <p className='font-poppins text-md font-medium'>Update History</p>
              <div className='w-full flex flex-col items-start'>
                {
                  updateCompleted.map((complete)=>{
                    return(
                      <div key={complete} className='flex mb-1'>
                        <p>{complete}</p>
                        <div className='w-3'/>
                        <div className='bg-green-600 rounded-xl px-3 py-0 flex flex-col justify-center'>
                          <p className='text-white text-xs font-medium'>Done</p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>  
    </>
  );
}

export default App