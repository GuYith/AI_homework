//采用链表
//定义链表节点元素，具有存储的值属性，和链属性
function Node ( element ) {
    this.element = element;
    this.next    = null;
}
//定义一个链表构造函数，里面包含一个头结点，和一些相关的方法
function LinkList () {
    this.head = new Node( "head" );
    this.insert = insert;
    this.remove = remove;
    this.findpre = findpre;
    this.length=length;
    this.isEmpty=isEmpty;
    this.findNumNode=findNumNode;
    this.clear=clear;
}

function findNumNode(d)
{
    var currNode=this.head;
    for(var i=0;i<=d;i++)
    {
       if(currNode.next!=null)
        {
            currNode=currNode.next;
        }
       
    }
    return currNode.element;
}

//在item 后面插入newElment节点，最后返回this是为了能够实现链式调用
function insert(newElment) {
    var newNode = new Node( newElment );
    var currNode = this.head;
    newNode.next = currNode.next;
    currNode.next= newNode;
    this.length++;
    return this;
}
//找到item 的前一个节点
function findpre ( item ) {
    var currNode = this.head;
    while ( currNode.next != null && currNode.next.element != item ) {
        currNode = currNode.next;
    }
    return currNode;
}
//遍历链表，删除目标节点
function remove ( element ) {
    var pre = this.findpre( element );
    if( pre.next != null ) {
        pre.next = pre.next.next;
    }
    this.length--;
    return this;
}
 //
function  isEmpty () {
    var currNode = this.head;
    if( currNode.next != null ) {
        return false;
    }
    return true;
}

function clear()
{
    var currNode=this.head;
    if(currNode.next!=null)
    {
        currNode.next=currNode.next.next;
    }
    this.length=0;
}