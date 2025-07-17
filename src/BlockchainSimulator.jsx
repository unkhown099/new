import React, { useState } from 'react';
import sha256 from 'crypto-js/sha256';
import './BlockchainSimulator.css';


const calculateHash = (index, timestamp, data, prevHash, nonce) => {
  return sha256(index + timestamp + JSON.stringify(data) + prevHash + nonce).toString();
};

const createGenesisBlock = () => {
  const timestamp = new Date().toISOString();
  return {
    index: 0,
    timestamp,
    data: 'Genesis Block',
    prevHash: '0',
    nonce: 0,
    hash: calculateHash(0, timestamp, 'Genesis Block', '0', 0)
  };
};

const mineBlock = (block, difficulty = 3) => {
  let nonce = 0;
  let hash = '';
  const target = Array(difficulty + 1).join('0');

  do {
    nonce++;
    hash = calculateHash(block.index, block.timestamp, block.data, block.prevHash, nonce);
  } while (!hash.startsWith(target));

  return { ...block, nonce, hash };
};

const BlockchainSimulator = () => {
  const [chain, setChain] = useState([createGenesisBlock()]);
  const [newData, setNewData] = useState('');

  const addBlock = () => {
    const prevBlock = chain[chain.length - 1];
    const newBlock = {
      index: prevBlock.index + 1,
      timestamp: new Date().toISOString(),
      data: newData || `Block #${prevBlock.index + 1}`,
      prevHash: prevBlock.hash,
      nonce: 0,
      hash: ''
    };
    const minedBlock = mineBlock(newBlock);
    setChain([...chain, minedBlock]);
    setNewData('');
  };

return (
  <div className="blockchain-container">
    <h1 className="title">Blockchain Simulator</h1>
    <input
      type="text"
      placeholder="Enter block data"
      value={newData}
      onChange={(e) => setNewData(e.target.value)}
      className="input-field"
    />
    <button
      onClick={addBlock}
      className="add-button"
    >
      Add Block
    </button>
    <div>
      {chain.map((block) => (
        <div key={block.index} className="block">
          <p><strong>Index:</strong> {block.index}</p>
          <p><strong>Timestamp:</strong> {block.timestamp}</p>
          <p><strong>Data:</strong> {block.data}</p>
          <p><strong>Previous Hash:</strong> {block.prevHash}</p>
          <p><strong>N-once:</strong> {block.nonce}</p>
          <p><strong>Hash:</strong> {block.hash}</p>
        </div>
      ))}
    </div>
  </div>
);

};

export default BlockchainSimulator;
