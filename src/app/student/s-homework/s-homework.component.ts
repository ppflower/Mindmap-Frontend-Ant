import {Component, Input, OnChanges, OnInit} from '@angular/core';

import { ShortQuestion } from '../../short-question';
import { StuMultiple } from '../../stu-multiple';
import { SNodeService } from '../s-node.service';
import { NzModalService } from 'ng-zorro-antd';
import { StuJudge } from '../../stu-judge';

@Component({
  selector: 'app-s-homework',
  templateUrl: './s-homework.component.html',
  styleUrls: ['./s-homework.component.css']
})
export class SHomeworkComponent implements OnInit, OnChanges {

  stuMultiples: StuMultiple[];
  stuShorts: ShortQuestion[];
  stuJudges: StuJudge[];

  @Input() course_id: string; // 与上层组件中course绑定
  @Input() mind_id: string; // 与上层组件中选中的mindMap绑定
  @Input() node_id: string;

  constructor(
    private nodeService: SNodeService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.updateHomework();
  }

  updateHomework() {
    // 获取所有的选择题
    this.nodeService.getStuMultiple(
      this.course_id,
      this.mind_id,
      this.node_id).subscribe(
      value => this.setMultiple(value));

    // 获取所有的简答题
    this.nodeService.getShort(
      this.course_id,
      this.mind_id,
      this.node_id).subscribe(
      value => this.setShort(value));

    // 获取所有的选择题
    this.nodeService.getStuJudge(
      this.course_id,
      this.mind_id,
      this.node_id).subscribe(
      value => this.setJudge(value));
  }

  setMultiple(value) {
    this.stuMultiples = value;
  }

  setShort(value) {
    this.stuShorts = value;
  }

  setJudge(value) {
    this.stuJudges = value;
  }

  // 提交选择题
  submitMultiple(stuMultiple: StuMultiple) {
    this.nodeService.answerMultiple(
      this.course_id,
      this.mind_id,
      this.node_id,
      window.sessionStorage.getItem('user_name'),
      stuMultiple).subscribe(
      value => this.checkSubmit(value['success']));
  }

  // 提交简答题
  submitShort(stuShort: ShortQuestion) {
    const inModal = this.modalService.success(
      {
        nzTitle: '提交成功',
        nzContent: '已保存简答题答案'
      });
    window.setTimeout(() => {
      inModal.destroy();
    }, 2000);
  }

  // 提交判断题
  submitJudge(stuJudge: StuJudge) {
    this.nodeService.answerJudge(
      this.course_id,
      this.mind_id,
      this.node_id,
      window.sessionStorage.getItem('user_name'),
      stuJudge).subscribe(
      value => this.checkSubmit(value['success']));
  }

  // 检查提交
  checkSubmit(value) {
    if (value) {
      const inModal = this.modalService.success(
        {
          nzTitle: '提交成功',
          nzContent: '已保存答案'
        });
      window.setTimeout(() => {
        inModal.destroy();
      }, 2000);
    } else {
      const inModal = this.modalService.error(
        {
          nzTitle: '提交失败',
          nzContent: '未知错误'
        });
      window.setTimeout(() => {
        inModal.destroy();
      }, 2000);
    }
  }

}
