/**
 * LFU Cache (Least Frequently Used)
 *
 * Summary: Cache that evicts least frequently used items.
 * Operations: Get O(1), Put O(1)
 * Space: O(capacity)
 * Implementation: Two HashMaps + Doubly Linked Lists per frequency
 */

class LFUNode<K, V> {
  key: K;
  value: V;
  frequency: number;
  prev: LFUNode<K, V> | null = null;
  next: LFUNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.frequency = 1;
  }
}

class DoublyLinkedList<K, V> {
  head: LFUNode<K, V>;
  tail: LFUNode<K, V>;
  size: number = 0;

  constructor() {
    this.head = new LFUNode<K, V>(null as K, null as V);
    this.tail = new LFUNode<K, V>(null as K, null as V);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  addToFront(node: LFUNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
    this.size++;
  }

  removeNode(node: LFUNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    this.size--;
  }

  removeLast(): LFUNode<K, V> | null {
    if (this.size === 0) return null;
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}

export class LFUCache<K, V> {
  private capacity: number;
  private cache: Map<K, LFUNode<K, V>>;
  private frequencyMap: Map<number, DoublyLinkedList<K, V>>;
  private minFrequency: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.frequencyMap = new Map();
    this.minFrequency = 0;
  }

  get(key: K): V | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;

    this.updateFrequency(node);
    return node.value;
  }

  put(key: K, value: V): void {
    if (this.capacity <= 0) return;

    let node = this.cache.get(key);

    if (node) {
      node.value = value;
      this.updateFrequency(node);
    } else {
      if (this.cache.size >= this.capacity) {
        this.evict();
      }

      node = new LFUNode(key, value);
      this.cache.set(key, node);

      if (!this.frequencyMap.has(1)) {
        this.frequencyMap.set(1, new DoublyLinkedList());
      }
      this.frequencyMap.get(1)!.addToFront(node);
      this.minFrequency = 1;
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) return false;

    const list = this.frequencyMap.get(node.frequency)!;
    list.removeNode(node);
    this.cache.delete(key);

    if (list.isEmpty()) {
      this.frequencyMap.delete(node.frequency);
      if (this.minFrequency === node.frequency) {
        this.minFrequency++;
      }
    }

    return true;
  }

  size(): number {
    return this.cache.size;
  }

  private updateFrequency(node: LFUNode<K, V>): void {
    const oldFreq = node.frequency;
    const oldList = this.frequencyMap.get(oldFreq)!;
    oldList.removeNode(node);

    if (oldList.isEmpty()) {
      this.frequencyMap.delete(oldFreq);
      if (this.minFrequency === oldFreq) {
        this.minFrequency++;
      }
    }

    node.frequency++;
    const newFreq = node.frequency;

    if (!this.frequencyMap.has(newFreq)) {
      this.frequencyMap.set(newFreq, new DoublyLinkedList());
    }
    this.frequencyMap.get(newFreq)!.addToFront(node);
  }

  private evict(): void {
    const minFreqList = this.frequencyMap.get(this.minFrequency);
    if (!minFreqList) return;

    const nodeToRemove = minFreqList.removeLast();
    if (nodeToRemove) {
      this.cache.delete(nodeToRemove.key);
    }

    if (minFreqList.isEmpty()) {
      this.frequencyMap.delete(this.minFrequency);
    }
  }

  // Get frequencies for debugging
  getFrequencies(): Map<K, number> {
    const result = new Map<K, number>();
    for (const [key, node] of this.cache) {
      result.set(key, node.frequency);
    }
    return result;
  }
}

export function demo(): string {
  console.log('LFU Cache Demo');
  console.log('==============');

  const cache = new LFUCache<number, string>(3);

  console.log('Adding items: 1="one", 2="two", 3="three"');
  cache.put(1, 'one');
  cache.put(2, 'two');
  cache.put(3, 'three');

  console.log('Frequencies:', Object.fromEntries(cache.getFrequencies()));

  console.log('\nAccessing 1 and 2 multiple times');
  cache.get(1);
  cache.get(1);
  cache.get(2);

  console.log('Frequencies:', Object.fromEntries(cache.getFrequencies()));

  console.log('\nAdding 4="four" (should evict 3, least frequently used)');
  cache.put(4, 'four');
  console.log('Has 3:', cache.has(3));
  console.log('Frequencies:', Object.fromEntries(cache.getFrequencies()));

  console.log('\nAdding 5="five" (should evict 4, tie-break by LRU)');
  cache.put(5, 'five');
  console.log('Has 4:', cache.has(4));
  console.log('Frequencies:', Object.fromEntries(cache.getFrequencies()));

  return `Cache size: ${cache.size()}`;
}
