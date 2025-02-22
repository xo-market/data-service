import fetch from 'node-fetch'; // Only needed for Node.js environments

export interface MarketMetaData {
  name: string;
  description: string;
  image: string;
  category: string;
  type: string;
  tags: string[];
  rules: string;
  external_url: string;
  animation_url: string;
  background_color: string;
}

interface MarketAPIResponse {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
  external_url: string;
  animation_url: string;
  background_color: string;
}

async function fetchData(url: string): Promise<MarketAPIResponse | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = (await response.json()) as MarketAPIResponse;
    return data;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

export async function extractMarketMetaData(ipfs_url: string): Promise<MarketMetaData | null> {
  try {
    const data = await fetchData(ipfs_url);
    if (!data) {
      throw new Error('Invalid JSON response');
    }

    const findAttribute = (type: string) =>
      data.attributes.find(attr => attr.trait_type === type)?.value || '';

    const metadata: MarketMetaData = {
      name: data.name,
      description: data.description,
      image: data.image,
      category: findAttribute('Category'),
      type: findAttribute('Type'),
      tags: Array.isArray(findAttribute('Tags')) ? (findAttribute('Tags') as unknown as string[]) : findAttribute('Tags') ? [findAttribute('Tags') as string] : [],
      rules: findAttribute('Rules'),
      external_url: data.external_url,
      animation_url: data.animation_url,
      background_color: data.background_color,
    };

    return metadata;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return null;
  }
}

