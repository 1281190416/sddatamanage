package com.smart.POJO;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class TreeNode<T> implements Iterable<TreeNode<T>> {

	public T data;
	public TreeNode<T> parent;
	public List<TreeNode<T>> children;

	public boolean isRoot() {
		return parent == null;
	}

	public boolean isLeaf() {
		return children.size() == 0;
	}
	public TreeNode(){}

	public TreeNode(T data) {
		this.data = data;
		this.children = new LinkedList<TreeNode<T>>();
	}

	public TreeNode<T> addChild(T child) {
		TreeNode<T> childNode = new TreeNode<T>(child);
		childNode.parent = this;
		this.children.add(childNode);
		return childNode;
	}

	public int getLevel() {
		if (this.isRoot())
			return 0;
		else
			return parent.getLevel() + 1;
	}



	//深度优先前序遍历
	public TreeNode<T> findTreeNode(Comparable<T> cmp) {
		//System.out.println(this.data);
		for (TreeNode<T> element : this.children) {
			T elData = element.data;
			if (cmp.compareTo(elData) == 0)
				return element;
			else {
				TreeNode<T> re = element.findTreeNode(cmp);
				if (re != null) return re;
			}
		}
		return null;
	}

	//打印以当前节点为根的子树
	public void printTree() {
		if(this!=null) System.out.println(this.data);
		for (TreeNode<T> element : this.children) {
			element.printTree();
		}
	}


		//@Override
	public String toString() {
		return data != null ? data.toString() : "[data null]";
	}

	//@Override
	// 实现迭代器接口
	public Iterator<TreeNode<T>> iterator() {
		TreeNodeIter<T> iter = new TreeNodeIter<T>(this);
		return iter;
	}

}
