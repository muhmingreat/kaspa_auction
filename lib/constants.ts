export const KA_EXPLORER_BASE_URL = 'https://explorer-tn10.kaspa.org';

export const getExplorerAddressUrl = (address: string) => `${KA_EXPLORER_BASE_URL}/addresses/${address}`;
export const getExplorerTxUrl = (txHash: string) => `${KA_EXPLORER_BASE_URL}/txs/${txHash}`;
