import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/constants';
import { MemberService } from '../services/memberService';

export class MemberController {
  private memberService: MemberService;

  constructor() {
    this.memberService = new MemberService();
  }

  createMember = asyncHandler(async (req: Request, res: Response) => {
    const created = await this.memberService.createMember(req.body);
    return sendSuccess(res, created, 'Member created successfully', HTTP_STATUS.CREATED);
  });

  listMembers = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query as any;
    const result = await this.memberService.listMembers(page, limit);
    return sendSuccess(res, result, 'Members retrieved successfully', HTTP_STATUS.OK);
  });

  updateMember = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updated = await this.memberService.updateMember(id, req.body);
    return sendSuccess(res, updated, 'Member updated successfully', HTTP_STATUS.OK);
  });

  deleteMember = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await this.memberService.deleteMember(id);
    return sendSuccess(res, deleted, 'Member deleted successfully', HTTP_STATUS.OK);
  });
}

