/**
 * LRU Cache (Least Recently Used)
 *
 * Summary: Cache with O(1) get and put operations.
 * Operations: Get O(1), Put O(1)
 * Space: O(capacity)
 * Implementation: HashMap + Doubly Linked List
 */

class LRUNode<K, V> {
  key: K;
  value: V;
  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, LRUNode<K, V>>;
  private head: LRUNode<K, V>; // Dummy head
  private tail: LRUNode<K, V>; // Dummy tail

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new LRUNode<K, V>(null as K, null as V);
    this.tail = new LRUNode<K, V>(null as K, null as V);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;

    // Move to front (most recently used)
    this.moveToFront(node);
    return node.value;
  }

  put(key: K, value: V): void {
    let node = this.cache.get(key);

    if (node) {
      // Update existing
      node.value = value;
      this.moveToFront(node);
    } else {
      // Add new
      node = new LRUNode(key, value);
      this.cache.set(key, node);
      this.addToFront(node);

      // Evict if over capacity
      if (this.cache.size > this.capacity) {
        const lru = this.removeLast();
        if (lru) {
          this.cache.delete(lru.key);
        }
      }
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) return false;

    this.removeNode(node);
    this.cache.delete(key);
    return true;
  }

  size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Get all keys in order from most to least recently used
  keys(): K[] {
    const result: K[] = [];
    let node = this.head.next;
    while (node && node !== this.tail) {
      result.push(node.key);
      node = node.next;
    }
    return result;
  }

  private addToFront(node: LRUNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: LRUNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private moveToFront(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.addToFront(node);
  }

  private removeLast(): LRUNode<K, V> | null {
    const node = this.tail.prev;
    if (node && node !== this.head) {
      this.removeNode(node);
      return node;
    }
    return null;
  }
}

// LRU Cache with TTL (Time To Live)
export class LRUCacheWithTTL<K, V> {
  private cache: LRUCache<K, { value: V; expiry: number }>;
  private defaultTTL: number;

  constructor(capacity: number, defaultTTL: number = Infinity) {
    this.cache = new LRUCache(capacity);
    this.defaultTTL = defaultTTL;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  put(key: K, value: V, ttl: number = this.defaultTTL): void {
    this.cache.put(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export function demo(): string {
  console.log('LRU Cache Demo');
  console.log('==============');

  const cache = new LRUCache<number, string>(3);

  console.log('Adding items: 1="one", 2="two", 3="three"');
  cache.put(1, 'one');
  cache.put(2, 'two');
  cache.put(3, 'three');

  console.log('Keys (MRU to LRU):', cache.keys());

  console.log('\nGet key 1:', cache.get(1));
  console.log('Keys after get(1):', cache.keys());

  console.log('\nAdding 4="four" (should evict 2)');
  cache.put(4, 'four');
  console.log('Keys:', cache.keys());
  console.log('Has 2:', cache.has(2));
  console.log('Has 1:', cache.has(1));

  console.log('\nUpdating 3="THREE"');
  cache.put(3, 'THREE');
  console.log('Keys:', cache.keys());
  console.log('Get 3:', cache.get(3));

  return `Cache keys: [${cache.keys().join(', ')}]`;
}
