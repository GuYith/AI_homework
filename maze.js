var num=15;
var chess = document.getElementById("mycanvas");
var context = chess.getContext('2d');      //渲染2D图像
var tree=[];        //树
var islink=[];      //连通表  
var value=[];       //树结点的大小
var astarclick=1;
var bfsclick=1;
var antclick=1;
function block(n)   //定义block结构体 n为编号
{
    this.m=n;
    this.x=parseInt(n/num);
    this.y=n%num;
    this.F=0;
    this.G=0;
    this.H=0;
    this.parent=null;
    this.time=time;
}


//以（25,25）为左上点
function drawChessBoard()//绘画
    {
        for(var i=0;i<num+1;i++)
        {
            context.strokeStyle='gray';//灰色画笔   可选区域
            context.moveTo(25+i*30,25);//垂直方向画num根线，相距30px;
            context.lineTo(25+i*30,25+30*num);
            context.stroke();
            context.moveTo(25,25+i*30);//水平方向画num根线，相距30px;棋盘为14*14；
            context.lineTo(25+30*num,25+i*30);
            context.stroke();
        }
        drawRect(29,29,20,20,'blue');
        drawRect(450,450,20,20,'#ff4433');
      
    }

function drawRect(x,y,width,height,color)
{
    context.fillStyle=color;
    context.fillRect(x,y,width,height);
}


function getnei(n)//获得邻居号  random
    {
        var a= new block(n);
        var x=a.x;//要精确成整数（首先是JavaScipt中变量无Int、float类型之分
        var y=a.y;         //a/num为小数
        var mynei=new Array();//储存邻居编号（还原）
        if(x-1>=0){mynei.push((x-1)*num+y);}//上节点
        if(x+1<num){mynei.push((x+1)*num+y);}//下节点
        if(y+1<num){mynei.push(x*num+y+1);}//有节点
        if(y-1>=0){mynei.push(x*num+y-1);}//下节点
        var ran=parseInt(Math.random() * mynei.length );//Math.random()返回0-1之间的数
        return mynei[ran];      //返回一个随机的邻居

    }


//n为当前节点编号
//tree[][]中存的是该节点的双亲节点
//     递归算法
//     getRoot(n)返回根节点编号
//     n为根节点时返回n
//     n为子节点是，返回getRoot(n的双亲)
function getRoot(n)
{
    var a= new block(n);
    if(tree[a.x][a.y]>0)//大于0是为子节点     根节点n的tree[][]=0
    {
        return getRoot(tree[a.x][a.y]);
    }
    else
        return n;
}
//计算树的大小      均为从根节点开始到树结束的H
function getvalue(n)
{
    var a= new block(n);
    if(tree[a.x][a.y]>0)//为子树时
    {
        return value[a.x][a.y]=getvalue(tree[a.x][a.y]);
       
    }
    else return value[a.x][a.y];
    
}
//合并两个树
//union(a,b)合并两树
//首先是当a,b为根节点时，置m并到n树上，n.value+=m.value
//m.tree[][]置为n
//若a,b不为根节点时，找到根节点
//  小树成为大树的子树
function union(n,m)         //合并某两个点即将其根节点union
{
    var nRoot=getRoot(n);
    var mRoot=getRoot(m);
    var a= new block(n);
    var b= new block(m);
    var aR= new block(nRoot);
    var bR= new block(mRoot);
   if(nRoot==mRoot)
   {

   }
   
   else 
   {
       if(getvalue(nRoot)>=getvalue(mRoot))  //将mRoot的加到nRoot树上
       {
        value[a.x][a.y]+=value[b.x][b.y];
        tree[bR.x][bR.y]=nRoot;
       }
       else                                 //将nRoot的加到mRoot树上
       {
        value[b.x][b.y]+=value[a.x][a.y];
        tree[aR.x][aR.y]=mRoot;
       }
    
   }

}

function drawline(n,m)
{
    var a= new block(n);
    var b= new block(m);
    var x=(a.x+b.x)/2;
    var y=(a.y+b.y)/2;
    
    //左右方向
    if(a.x-b.x==1||a.x-b.x==-1)
    {
        context.strokeStyle='white';
        context.fillStyle='white';
        context.fillRect(x*30+39,y*30+26,2,28);
    }
    else//上下方向
    {
        context.strokeStyle='white';
        context.fillStyle='white';
        context.fillRect(x*30+26,y*30+39,28,2);
    }
}
function clearCanvas()      //清空地图
{
    var chess = document.getElementById("mycanvas");
    var context = chess.getContext('2d'); 
    chess.height=chess.height;  
    chess.width=chess.width;  
}
function linkedToFirst()
{
    for(var i=0;i<=num*num-1;i++)
    {
        if(getRoot(0)!=getRoot(i))
            return false;
    }
     return true;
}
function drawPathRect(x,y)
{
    context.fillStyle="rgba(333,255,0,0.6)";
    context.fillRect(x,y,30,30);
}
function drawPath2Rect(x,y)
{
    context.fillStyle="rgba(122,2,333,0.6)";
    context.fillRect(x,y,30,30);
}
function drawAstarOpenRect(x,y)
{
    context.fillStyle="rgba(11,255,33,0.2)";
    context.fillRect(x,y,30,30);
}
function drawBFSOpenRect(x,y)
{
    context.fillStyle="rgba(0,223,245,0.2)";
    context.fillRect(x,y,30,30);
}

/**************************************
 * Astar算法
 * *************************************/
var open1=new LinkList();
var close1=new LinkList();
var cost =1;
//进open1表的为block

//计算结点nblk的G
//移动的步数为G
function calcG(nblk)
{
    var curblk=nblk;
    var extraG=cost;
    var parentG=getRoot(curblk.m)==-1?0:curblk.parent.G;
    return extraG+parentG;
}
//将与end的欧氏距离或曼哈顿距离作为结点nblk的H
//H*为当前块到终点的距离>x与y的曼哈顿距离>x与y的欧氏距离>H
//均满足H<H*
//考虑H越接近H*越优，因而取曼哈顿距离
function calcH(nblk,end)
{
    var curblk=nblk;
    var e=end;
    return e.x-curblk.x+e.y-curblk.y;
    //return Math.sqrt((e.x-curblk.x)*(e.x-curblk.x)+(e.y-curblk.y)*(e.y-curblk.y));
}

//F=G+H  
function calcF(nblk)
{
    var curblk=nblk;
    return curblk.G+curblk.H;
}
//返回block n的可遍历的所有邻居的编号链表
function getsurroudblocks(n)
{
    var surroundBlock=new LinkList();
    x=n.x;
    y=n.y;
    if(y-1>=0)
    {
        var m=new block(x*num+y-1);
        if(isAstarCanReach(n,m))
        {
        m.parent=n;
        surroundBlock.insert(m);
        }
    }//上节点
    if(y+1<num)
    {
        var m=new block(x*num+y+1);
        if(isAstarCanReach(n,m))
        {
            m.parent=n;
            surroundBlock.insert(m);
        }
            
    }//下节点
    if(x+1<num)
    {
        var m=new block((x+1)*num+y);
        if(isAstarCanReach(n,m))
        {
        m.parent=n;
        surroundBlock.insert(m);
        }

    }//右节点
    if(x-1>=0)
    {
        var m=new block((x-1)*num+y);
        if(isAstarCanReach(n,m))
        {
        m.parent=n;
        surroundBlock.insert(m);
        }
    }//左节点
    return surroundBlock;
}

//返回F最小的block
function getLeastFBlock()
{
    if(!open1.isEmpty())
    {
        var resBlock=open1.head.next.element;
        for(var i=0;i<open1.length;i++)
        {
            var curiBlock=open1.findNumNode(i);
            if(curiBlock.F < resBlock.F)
                resBlock=curiBlock;
            return resBlock;
        }
        return null;
    }
}
//判断nblock是否在open1表里
function isInlist(open1,nblock)
{
    if(open1.length==0)
    {
        return null;
    }
    else
    {
        for(var i=0;i<open1.length;i++)
        {
            var iblk=open1.findNumNode(i);
            if(nblock.x==iblk.x && nblock.y==iblk.y)
            {
                return open1;
            }
        }
        return null;
    }
    
}


function isAstarCanReach(curblk,target)
{
    if(islink[curblk.m][target.m]==0||isInlist(close1,target)||curblk==target)
        return false;
    else
        return true;
}

function returnPath(find,end)
{
    if(!find)
        return false;
    else
    {
        var curblk=end;
        while(curblk!=null)
        {
            drawPathRect(25+30*curblk.x,25+30*curblk.y);
            var m=curblk.parent;
            curblk=m;
            
        }
    }
}
//start end 为block
function AstarfindPath(start,end)
{
    open1.clear();
    close1.clear();
    open1.insert(start);     //首先将起点加入open1表
    drawAstarOpenRect(25,25);
    while(!open1.isEmpty()&&!isInlist(open1,end))  //若为空，结束遍历
    {
        var curblk=getLeastFBlock();    //curblk为open1表中F值最小的结点
        var surround=getsurroudblocks(curblk);//Block类型  得到curblk的邻居结点表
        open1.remove(curblk);    //将curblk移出遍历表（因为已遍历结束）
        close1.insert(curblk);   //将curblk加入close1表
        curblk.F=0;
        curblk.H=0;
        curblk.G=0;
        for(var i=0;i<surround.length;i++) //依次遍历surround中的所有结点（Block类型）
        {
            var target=surround.findNumNode(i); //设置本次的目标target
        
            if(isInlist(open1,target)==null)    //如果target不在open1表中
            {
                target.parent=curblk;       //完成初始化
                target.G=calcG(target);       
                target.H=calcH(target,end);
                target.F=calcF(target);
                open1.insert(target);    // 加入open1表
             drawAstarOpenRect(25+target.x*30,25+target.y*30);
             
            }
            else//若target在open1中则
            {
                var tempG=calcG(target);//重新计算G值
                if(tempG<target.G)//若重新计算后G要小则更新
                {
                    target.parent = curblk;//修改指针
					target.G = tempG;
					target.F = calcF(target);
                }
            }
            var resBlock=isInlist(open1,end);//如果end在open1表中则返回resBlock（即当前的open1表）,算法结束
            if(target.m===224)
            {
                end.parent=curblk;
                return resBlock;
            }
            
        }    
    }
    return null;
}
console.time("Astar");
function aStar()
{
    
    var find=AstarfindPath(start,end);
    returnPath(find,end);

}
console.timeEnd("Astar");

/**************************************
 * 宽度优先搜索算法
 * *************************************/


var direction=
[
    [0,1],
    [0,-1],
    [1,0],
    [-1,0]
];

function isInArray(open2,nblock)
{
    if(open2.length==0)
    {
        return null;
    }
    else
    {
        for(var i=0;i<open2.length;i++)
        {
            var iblk=open2[i];
            if(nblock.x==iblk.x && nblock.y==iblk.y)
            {
                return open2;
            }
        }
        return null;
    }
}
function isBFSCanReach(nblock,mblock)
{
    if(islink[nblock.m][mblock.m]==0||mblock==nblock||isInArray(close2,mblock))
    return false;
    else
    return true;
}
var open2=new Array();
var close2=new Array();
console.time("BFS");
function BFS(start,end)
{
   open2.length=0;
   close2.length=0;
    open2.push(start);
    drawBFSOpenRect(25,25);
    while(open2.length!=0)
    {
        var curblk;
        curblk=open2.shift();
        close2.push(curblk);
        for(var i=0;i<4;i++)
        {  
            var surroundBlock_x=curblk.x+direction[i][0];
            var surroundBlock_y=curblk.y+direction[i][1];
            if(surroundBlock_x>=0&&surroundBlock_x<num&&surroundBlock_y>=0&&surroundBlock_y<num)
            {
                var surroundBlock=new block(surroundBlock_x*num+surroundBlock_y)
                if(isBFSCanReach(curblk,surroundBlock)&&!isInArray(open2,surroundBlock))
                {
    
                    surroundBlock.parent=curblk;
                    drawBFSOpenRect(surroundBlock.x*30+25,surroundBlock.y*30+25);
                    open2.push(surroundBlock);
                }
                if(surroundBlock.m==224)
                {
                    end.parent=curblk;
                    var outblk=end;
                    while(outblk!=null)
                    {
                        drawPathRect(25+30*outblk.x,25+30*outblk.y);
                        var m=outblk.parent;
                        outblk=m;
                    }
                    return true;
                }
            }
            
        }
    }
    return false;
}
console.timeEnd("BFS");

/***********************
蚁群算法OS 
一个食物信息素数组food[][]
***********************/
var food=[];
var time=200000;//迭代次数
var besttour=[];//最短的路径
var antpast=[];
function drawAntsRect(x,y)
{
    context.fillStyle="rgba(555,222,22,0.06)";
    context.fillRect(x,y,30,30);
}
//每只蚂蚁
function ant(name)
{
    this.name=name;
    this.tour=[];//路径
    this.getAntnext=getAntnext;
    this.pherChoose=pherChoose;
    this.isantCanReach=isantCanReach;

}

//信息素更新表
//每一轮结束后更新信息素
function getFoodPheromone()
{
    for(var i=0;i<num*num;i++)//更新的是整个地图，有输出所有蚂蚁走过的点的信息素浓度
    {
        food[i]+=200*antpast[i];
        if(food[i]>0)
        {
            food[i]-=0.5;
        }
        antpast[i]=0;
        
    }  
}
//判断蚂蚁是否可到下一个节点
function isantCanReach(nblock,mblock)
{
    //是否连通，是否相同
    if(islink[nblock.m][mblock.m]==0||mblock==nblock)
        return false;
    else
        return true;
}
//产生信息素选择下一步的节点
function pherChoose(curblk)
{
    
    var chooseList=[];  //一个移动表
    var phre=[];      //记录信息素的浓度
    var p=[];       //记录选择概率
    var j=0;
    
    for(var i=0;i<4;i++)
    {  
        var surBlock_x=curblk.x+direction[i][0];
        var surBlock_y=curblk.y+direction[i][1];//产生下一个节点
        if(surBlock_x>=0&&surBlock_x<num&&surBlock_y>=0&&surBlock_y<num)
        {
            var surBlock=new block(surBlock_x*num+surBlock_y)
            if(ant[this.name].isantCanReach(curblk,surBlock))
            {
                chooseList.push(surBlock);//如果可以加入移动表
                phre[j]=food[surBlock.m];//可选移动节点的信息素浓度表
                j++;
            }
        }
    }

    if(chooseList==null)
    {
        return false;
    }
    var choose=Math.random();
    var sum=0;
    for(var i=0;i<j;i++)//计算总浓度
    {
        sum +=phre[i];
    }
    if(sum!=0)//sum!=0,轮盘赌选择
    {
        for(var i=0;i<j;i++)
        {
            var allP=0;
            p[i]=phre[i]/sum;
            allP+=p[i];
            if(choose<allP)   //表明选择了i
            {
                ant[this.name].tour.push(chooseList[i]);
                chooseList[i].time=time;
            }
        }
    }
    else//没有信息素直接选择第一个下一节点
    {
        if(j==1)
        {
            ant[this.name].tour.push(chooseList[j-1]);
        }
        else
        {
            var a =Math.round((choose*10000+1333)%(j-1)) ;
            ant[this.name].tour.push(chooseList[a]);
        }
    }
}
var bestant=0;
var bestlength;
var backblk;
var flag=0;
var drawpath=0;
var antget=[];
function getAntnext()//获得下一步
{
    var last=ant[this.name].tour.length; //最新的节点编号+1
    var CBLK=ant[this.name].tour[last-1];//得到最新节点
    ant[this.name].pherChoose(CBLK);//选择下一步
    drawAntsRect(25+30*CBLK.x,25+30*CBLK.y)//画出节点
    var last=ant[this.name].tour.length;

//如果找到了就可以开始回去
    if(ant[this.name].tour[last-1].m==224)
    {
        antget.push(ant[this.name].name);
        if(flag==0)
        {
            bestlength=ant[this.name].tour.length;
            flag=1;
        }
        if(ant[this.name].tour.length<=bestlength)
        {
            bestant=ant[this.name].name;
            besttour.length=0;
            bestlength=ant[this.name].tour.length;
            while(ant[this.name].tour!=0)
            {
                backblk=ant[this.name].tour.pop();
                besttour.push(backblk);
                antpast[backblk.m]=1;
            }
        }
        ant[this.name].tour.length=0;
      
        var blk=new block(0);
        ant[this.name].tour.push(blk);  
    }
}

console.time("antColony");
function antColony()
{
    
    for(var i=0;i<100;i++)
    {
        ant[i]= new ant(i);
        var blk=new block(0);
        ant[i].tour.push(blk);//初始节点加入当前蚂蚁的路径
    }
    for(var i=0;i<num*num;i++)
    {
        food[i]=0;
        antpast[i]=0;
    }
    food[224]=200000;
    while(time>=0)
    {
      for(var i=0;i<100;i++)//每一轮遍历100只蚂蚁均走一步
        {
            ant[i].getAntnext();
        }
        getFoodPheromone();//更新信息素
        time--;
    }
    for(var i=0;i<bestlength;i++)
    {
        var pathblk=besttour.pop();
        drawpath++;
        drawPath2Rect(25+30*pathblk.x,25+30*pathblk.y);//输出最短路径
    }
} 
console.timeEnd("antColony");


/***********************/
/***********************/


//getRoot(0)!=getRoot(num*num-1)为迷宫生成的标志
//改为如下是为了消除封闭方格

function updateMaze()
{

 astarclick=1;
 bfsclick=1;
 antclick=1;
     for(var i=0;i<num;i++)
{
    tree[i]=[];
    for(var j=0;j<num;j++)
    {
        tree[i][j]=-1;
    }
}
for(var i=0;i<num;i++)
{
    value[i]=[];
    for(var j=0;j<num;j++)
    {
        value[i][j]=1;
    }
}
for(var i=0;i<num*num;i++)
{
    islink[i]=[];
    for(var j=0;j<num*num;j++)
    {
        islink[i][j]=0;
    }
}

    drawChessBoard();
    
    while(linkedToFirst()==0)
    {
        var n = parseInt(Math.random() * num*num );//产生一个小于225的随机数
        var neighbor=getnei(n);
        if(getRoot(n)==getRoot(neighbor)){continue;}
        else//不在一个上
        {
            union(n,neighbor);  
           islink[n][neighbor]=1;islink[neighbor][n]=1;
            drawline(n,neighbor);//划线
               
        }
    }
}
updateMaze();   

var start=new block(0);
var end=new block(224);



