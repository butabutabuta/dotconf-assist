class InputLogsController < ApplicationController
  before_action :set_input_log, only: [:show, :edit, :update, :destroy]

  # GET /input_logs
  # GET /input_logs.json
  def index
    @input_logs = InputLog.all
  end

  # GET /input_logs/1
  # GET /input_logs/1.json
  def show
  end

  # GET /input_logs/new
  def new
    @input_log = InputLog.new
  end

  # GET /input_logs/1/edit
  def edit
  end

  # POST /input_logs
  # POST /input_logs.json
  def create
    @input_log = InputLog.new(input_log_params)

    respond_to do |format|
      if @input_log.save
        format.html { redirect_to @input_log, notice: 'Input log was successfully created.' }
        format.json { render :show, status: :created, location: @input_log }
      else
        format.html { render :new }
        format.json { render json: @input_log.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /input_logs/1
  # PATCH/PUT /input_logs/1.json
  def update
    respond_to do |format|
      if @input_log.update(input_log_params)
        format.html { redirect_to @input_log, notice: 'Input log was successfully updated.' }
        format.json { render :show, status: :ok, location: @input_log }
      else
        format.html { render :edit }
        format.json { render json: @input_log.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /input_logs/1
  # DELETE /input_logs/1.json
  def destroy
    @input_log.destroy
    respond_to do |format|
      format.html { redirect_to input_logs_url, notice: 'Input log was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_input_log
      @input_log = InputLog.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def input_log_params
      params.require(:input_log).permit(:splunk_user_id, :source_hostname, :log_file_path, :sourcetype, :log_file_size, :data_retention_period, :memo, :crcsalt)
    end
end
