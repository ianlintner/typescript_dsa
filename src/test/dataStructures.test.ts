import { describe, it, expect } from 'vitest';
import { UnionFind } from '../data-structures/unionFind';
import { Trie } from '../data-structures/trie';
import { LRUCache } from '../data-structures/lruCache';
import { MinHeap, MaxHeap } from '../data-structures/heapPatterns';

describe('Data Structures', () => {
  describe('Union Find', () => {
    it('should perform union and find operations', () => {
      const uf = new UnionFind(5);
      uf.union(0, 1);
      uf.union(2, 3);
      expect(uf.connected(0, 1)).toBe(true);
      expect(uf.connected(0, 2)).toBe(false);
      uf.union(1, 2);
      expect(uf.connected(0, 3)).toBe(true);
    });

    it('should track component count', () => {
      const uf = new UnionFind(5);
      expect(uf.getCount()).toBe(5);
      uf.union(0, 1);
      expect(uf.getCount()).toBe(4);
    });
  });

  describe('Trie', () => {
    it('should insert and search words', () => {
      const trie = new Trie();
      trie.insert('apple');
      expect(trie.search('apple')).toBe(true);
      expect(trie.search('app')).toBe(false);
      expect(trie.startsWith('app')).toBe(true);
    });

    it('should check prefixes correctly', () => {
      const trie = new Trie();
      trie.insert('apple');
      trie.insert('app');
      trie.insert('apply');
      expect(trie.startsWith('app')).toBe(true);
      expect(trie.search('app')).toBe(true);
      expect(trie.search('apple')).toBe(true);
    });
  });

  describe('LRU Cache', () => {
    it('should store and retrieve values', () => {
      const cache = new LRUCache<string, number>(2);
      cache.put('a', 1);
      cache.put('b', 2);
      expect(cache.get('a')).toBe(1);
    });

    it('should evict least recently used', () => {
      const cache = new LRUCache<string, number>(2);
      cache.put('a', 1);
      cache.put('b', 2);
      cache.put('c', 3); // evicts 'a'
      expect(cache.get('a')).toBeUndefined();
      expect(cache.get('b')).toBe(2);
      expect(cache.get('c')).toBe(3);
    });
  });

  describe('MinHeap', () => {
    it('should maintain min heap property', () => {
      const heap = new MinHeap<number>();
      heap.push(3);
      heap.push(1);
      heap.push(2);
      expect(heap.peek()).toBe(1);
      expect(heap.pop()).toBe(1);
      expect(heap.pop()).toBe(2);
      expect(heap.pop()).toBe(3);
    });
  });

  describe('MaxHeap', () => {
    it('should maintain max heap property', () => {
      const heap = new MaxHeap<number>();
      heap.push(1);
      heap.push(3);
      heap.push(2);
      expect(heap.peek()).toBe(3);
      expect(heap.pop()).toBe(3);
      expect(heap.pop()).toBe(2);
      expect(heap.pop()).toBe(1);
    });
  });
});
